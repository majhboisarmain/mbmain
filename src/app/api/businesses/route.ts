export const dynamic = 'force-dynamic';
export const revalidate = 0;

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { uploadImage, uploadGallery } from '@/lib/cloudinary';
import { specialProfiles } from '@/lib/mockProfiles'; // Clean HMR
import { businessSchema } from '@/lib/validations';
import { badRequestResponse, internalServerErrorResponse } from '@/lib/authGuard';
import { expandCategorySearchTerms } from '@/lib/categoryMapping';

function getHaversineDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const query = searchParams.get('query');
    const location = searchParams.get('location');
    const showAll = searchParams.get('showAll') === 'true' || searchParams.get('admin') === 'true';
    const premium = searchParams.get('premium') === 'true';
    const minRating = searchParams.get('rating') ? parseFloat(searchParams.get('rating')!) : null;

    const userLatStr = searchParams.get('userLat') || searchParams.get('lat');
    const userLngStr = searchParams.get('userLng') || searchParams.get('lng');
    const userLat = userLatStr ? parseFloat(userLatStr) : null;
    const userLng = userLngStr ? parseFloat(userLngStr) : null;
    const hasUserLocation = userLat !== null && !isNaN(userLat) && userLng !== null && !isNaN(userLng);

    const where: any = {};

    if (!showAll) {
      where.verified = true;
    }

    if (category && category !== 'All') {
      const categoryTerms = expandCategorySearchTerms(category);
      const cleanCat = category.trim();
      const singular = cleanCat.endsWith('s') ? cleanCat.slice(0, -1) : cleanCat;
      const plural = cleanCat.endsWith('s') ? cleanCat : cleanCat + 's';
      
      const allCategoryCandidates = Array.from(new Set([
        cleanCat,
        singular,
        plural,
        ...categoryTerms,
        ...categoryTerms.map(t => t.endsWith('s') ? t.slice(0, -1) : t + 's')
      ])).filter(Boolean);

      where.OR = [
        ...(where.OR || []),
        { category: { in: allCategoryCandidates } },
        { category: { contains: singular } }
      ];
    }

    if (premium) {
      where.premium = true;
    }

    if (minRating) {
      where.rating = { gte: minRating };
    }

    if (query) {
      const cleanQuery = query.toLowerCase().trim();
      const rawTokens = cleanQuery.split(/\s+/).filter(t => t.length > 0);
      const filteredTokens = rawTokens.filter(t => !['in', 'near', 'me', 'boisar', 'tarapur', 'palghar', 'best', 'top', 'service', 'services'].includes(t));
      const searchTokens = filteredTokens.length > 0 ? filteredTokens : rawTokens;

      const expandedTerms = expandCategorySearchTerms(query);
      const orConditions: any[] = [];

      searchTokens.forEach(st => {
        orConditions.push({ name: { contains: st } });
        orConditions.push({ description: { contains: st } });
        orConditions.push({ category: { contains: st } });
        orConditions.push({ address: { contains: st } });
        orConditions.push({
          services: {
            some: {
              name: { contains: st }
            }
          }
        });
      });

      expandedTerms.forEach(term => {
        orConditions.push({ category: { contains: term.toLowerCase() } });
        orConditions.push({ name: { contains: term.toLowerCase() } });
      });

      if (orConditions.length > 0) {
        where.OR = orConditions;
      }
    }

    const businesses = await prisma.business.findMany({
      where,
      include: {
        reviews: {
          orderBy: { createdAt: 'desc' },
          take: 5
        },
        services: true,
        products: true,
        faqs: true
      },
      orderBy: [
        { views: 'desc' },
        { rating: 'desc' },
        { premium: 'desc' }
      ]
    });

    let result: any[] = businesses.map(b => {
      const parts = (b.image || '').split('||gallery_sep||');
      let cover = parts[0] || '';
      if (!cover || cover.includes('unsplash.com')) {
        cover = '/majh-boisar-mb-logo.png';
      }
      const cleanDescription = (b.description || '').replace(/\[Created by Admin\]\s*/gi, '').trim();

      let distanceKm: number | null = null;
      if (hasUserLocation && b.latitude != null && b.longitude != null) {
        distanceKm = Math.round(getHaversineDistanceKm(userLat, userLng, b.latitude, b.longitude) * 10) / 10;
      }

      return {
        ...b,
        description: cleanDescription,
        image: cover,
        gallery: parts.slice(1),
        distanceKm
      };
    });

    // --- INJECT SPECIAL PROFILES IF ANY MATCH ---
    if (query) {
      const lowerQuery = query.toLowerCase();
      let matchedSpecial: any[] = [];
      for (const cat in specialProfiles) {
        const catMatches = cat.includes(lowerQuery) || 
                           (lowerQuery.includes('maid') && cat === 'helpers') ||
                           (lowerQuery.includes('kamwali') && cat === 'helpers') ||
                           (lowerQuery.includes('real estate') && cat === 'properties') ||
                           (lowerQuery.includes('cook') && cat === 'helpers');
        
        const profilesInCat = (specialProfiles[cat] || []).filter((p: any) => 
          catMatches || 
          p.name.toLowerCase().includes(lowerQuery) || 
          p.category.toLowerCase().includes(lowerQuery) || 
          p.bio?.toLowerCase().includes(lowerQuery) ||
          p.services?.some((s: string) => s.toLowerCase().includes(lowerQuery))
        );
        matchedSpecial.push(...profilesInCat);
      }

      const mappedSpecials = matchedSpecial.map(foundProfile => ({
        id: foundProfile.id,
        name: foundProfile.name,
        category: foundProfile.category,
        description: foundProfile.bio,
        address: "Boisar, MH",
        phone: foundProfile.phone,
        whatsapp: foundProfile.phone,
        verified: foundProfile.verified ?? true,
        premium: true,
        subscription: foundProfile.subscription || 'Premium',
        rating: foundProfile.rating,
        reviewCount: foundProfile.reviewsCount,
        image: foundProfile.avatar || '',
        gallery: foundProfile.gallery || [],
        location: "Boisar, MH",
        workingHours: "9:00 AM - 8:00 PM",
        views: foundProfile.views || 100,
        services: (foundProfile.services || []).map((s: string, idx: number) => ({ id: idx, name: s })),
        listingType: foundProfile.listingType || 'agent',
        videos: foundProfile.videos || [],
        distanceKm: null
      }));

      result = [...result, ...mappedSpecials];
    }

    // Explicit text location filter
    if (location && location !== 'All') {
      result.sort((a, b) => {
        const aMatches = a.location?.toLowerCase().includes(location.toLowerCase());
        const bMatches = b.location?.toLowerCase().includes(location.toLowerCase());
        
        if (aMatches && !bMatches) return -1;
        if (!aMatches && bMatches) return 1;
        return 0;
      });
    }

    // Smart Ranking:
    // Scenario 2: GPS User Location provided
    if (hasUserLocation) {
      const MAX_RADIUS_KM = 1.0;
      const withinRadius = result.filter(b => b.distanceKm !== null && b.distanceKm <= MAX_RADIUS_KM);
      const outsideRadius = result.filter(b => b.distanceKm === null || b.distanceKm > MAX_RADIUS_KM);

      if (withinRadius.length > 0) {
        // Sort 1km businesses by nearest distance first, then views & rating
        withinRadius.sort((a, b) => {
          if ((a.distanceKm ?? 999) !== (b.distanceKm ?? 999)) {
            return (a.distanceKm ?? 999) - (b.distanceKm ?? 999);
          }
          if ((b.views || 0) !== (a.views || 0)) return (b.views || 0) - (a.views || 0);
          return (b.rating || 0) - (a.rating || 0);
        });

        // Sort outside 1km businesses by views & rating
        outsideRadius.sort((a, b) => {
          if ((b.views || 0) !== (a.views || 0)) return (b.views || 0) - (a.views || 0);
          return (b.rating || 0) - (a.rating || 0);
        });

        result = [...withinRadius, ...outsideRadius];
      } else {
        // No businesses in 1km -> Fallback to Profile Views & Rating
        result.sort((a, b) => {
          if ((b.views || 0) !== (a.views || 0)) return (b.views || 0) - (a.views || 0);
          return (b.rating || 0) - (a.rating || 0);
        });
      }
    } else {
      // Scenario 1: Google Direct Search / Organic Traffic -> Sort by Views DESC, Rating DESC
      result.sort((a, b) => {
        if ((b.views || 0) !== (a.views || 0)) return (b.views || 0) - (a.views || 0);
        if ((b.rating || 0) !== (a.rating || 0)) return (b.rating || 0) - (a.rating || 0);
        if (a.premium && !b.premium) return -1;
        if (!a.premium && b.premium) return 1;
        return 0;
      });
    }

    return NextResponse.json(result);
  } catch (error: any) {
    return internalServerErrorResponse('/api/businesses GET', error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Server-side Zod validation
    const validationResult = businessSchema.safeParse(body);
    if (!validationResult.success) {
      return badRequestResponse(
        validationResult.error.issues[0].message,
        validationResult.error.flatten()
      );
    }

    const { name, category, description, address, phone, whatsapp, website, email, instagram, facebook, youtube, googleMaps, image, location, workingHours } = body;

    // 1-business limit per mobile number for Free plan check (Admin exempt)
    const ownerPhoneDigits = (body.ownerPhone || body.createdBy || phone || '').replace(/\D/g, '');
    if (ownerPhoneDigits && body.createdBy !== 'Admin') {
      const last7 = ownerPhoneDigits.slice(-7);
      try {
        const existingBusinesses = await prisma.business.findMany({
          where: {
            OR: [
              { createdBy: body.ownerPhone || body.createdBy || phone },
              { phone: { contains: last7 } },
              { whatsapp: { contains: last7 } }
            ]
          }
        });

        if (existingBusinesses.length >= 1 && (!body.subscription || body.subscription === 'Free')) {
          return NextResponse.json(
            { error: 'Free plan allows only 1 business listing per mobile number. To register a 2nd business/outlet, please upgrade to our Basic Plan (₹99/month).' },
            { status: 400 }
          );
        }
      } catch (checkErr) {
        console.warn('Error checking existing business count:', checkErr);
      }
    }

    const uploadedCover = await uploadImage(image);
    const uploadedGallery = await uploadGallery(body.gallery);

    let finalImage = uploadedCover || '/majh-boisar-mb-logo.png';
    if (uploadedGallery.length > 0) {
      finalImage = [finalImage, ...uploadedGallery].join('||gallery_sep||');
    }

    const cleanDesc = (description || '').replace(/\[Created by Admin\]\s*/gi, '').trim();

    let business: any;
    try {
      business = await prisma.business.create({
        data: {
          name,
          category,
          description: cleanDesc,
          address: address || '',
          phone,
          whatsapp: whatsapp || phone,
          website: website || null,
          email: email || null,
          instagram: instagram || null,
          facebook: facebook || null,
          youtube: youtube || null,
          googleMaps: googleMaps || null,
          image: finalImage,
          location: location || 'Boisar',
          latitude: body.latitude != null ? parseFloat(body.latitude) : null,
          longitude: body.longitude != null ? parseFloat(body.longitude) : null,
          workingHours: workingHours || '9:00 AM - 9:00 PM',
          subscription: body.subscription || (body.createdBy === 'Admin' ? 'Admin Created' : 'Free'),
          verified: body.verified !== undefined 
            ? body.verified 
            : (category?.toLowerCase().includes('maid') || category?.toLowerCase().includes('helper') ? false : true),
          premium: body.premium !== undefined ? body.premium : (body.createdBy === 'Admin' ? true : false),
          rating: body.rating !== undefined ? parseFloat(body.rating) : 5.0,
          createdBy: body.ownerPhone || body.createdBy || (body.createdBy === 'Admin' ? 'Admin' : null)
        }
      });
    } catch (createErr: any) {
      console.warn('Prisma create with createdBy failed, retrying without createdBy:', createErr?.message);
      business = await prisma.business.create({
        data: {
          name,
          category,
          description: cleanDesc,
          address: address || '',
          phone,
          whatsapp: whatsapp || phone,
          website: website || null,
          email: email || null,
          instagram: instagram || null,
          facebook: facebook || null,
          youtube: youtube || null,
          googleMaps: googleMaps || null,
          image: finalImage,
          location: location || 'Boisar',
          workingHours: workingHours || '9:00 AM - 9:00 PM',
          subscription: body.subscription || (body.createdBy === 'Admin' ? 'Admin Created' : 'Free'),
          verified: body.verified !== undefined 
            ? body.verified 
            : (category?.toLowerCase().includes('maid') || category?.toLowerCase().includes('helper') ? false : true),
          premium: body.premium !== undefined ? body.premium : (body.createdBy === 'Admin' ? true : false),
          rating: body.rating !== undefined ? parseFloat(body.rating) : 5.0
        }
      });
    }

    const parts = (business.image || '').split('||gallery_sep||');
    const result = {
      ...business,
      image: parts[0] || '',
      gallery: parts.slice(1)
    };

    return NextResponse.json(result, { status: 201 });
  } catch (error: any) {
    console.error('Error in POST /api/businesses:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to create business listing. Please try again.' },
      { status: 500 }
    );
  }
}
