import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { uploadImage, uploadGallery } from '@/lib/cloudinary';
import { specialProfiles } from '@/lib/mockProfiles';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const businessId = parseInt(id);

    if (isNaN(businessId)) {
      return NextResponse.json({ error: 'Invalid business ID' }, { status: 400 });
    }

    // 1. First try finding in Prisma Database
    try {
      const business = await prisma.business.findUnique({
        where: { id: businessId },
        include: {
          reviews: { orderBy: { createdAt: 'desc' } },
          services: true,
          products: true,
          faqs: true,
          leads: { orderBy: { createdAt: 'desc' } }
        }
      });

      if (business) {
        const shouldTrackView = request.nextUrl.searchParams.get('trackView') === 'true';
        if (shouldTrackView) {
          // Increment view count asynchronously only on actual user profile visit
          prisma.business.update({
            where: { id: businessId },
            data: { views: { increment: 1 } }
          }).catch(() => {});
        }

        const parts = (business.image || '').split('||gallery_sep||');
        return NextResponse.json({
          ...business,
          image: parts[0] || "",
          gallery: parts.slice(1)
        });
      }
    } catch (dbErr) {
      console.warn('Prisma DB business lookup error, checking fallback profiles:', dbErr);
    }

    // 2. Secondary Lookup: Check specialProfiles / mock profiles
    let foundProfile: any = null;
    for (const cat in specialProfiles) {
      const match = specialProfiles[cat].find((p: any) => p.id === businessId);
      if (match) {
        foundProfile = match;
        break;
      }
    }

    if (foundProfile) {
      return NextResponse.json({
        id: foundProfile.id,
        name: foundProfile.name,
        category: foundProfile.category,
        description: foundProfile.bio || foundProfile.description || 'Verified Business in Boisar',
        address: foundProfile.address || "Boisar, MH",
        phone: foundProfile.phone || "9820098200",
        whatsapp: foundProfile.phone || "9820098200",
        verified: foundProfile.verified ?? true,
        premium: true,
        subscription: foundProfile.subscription || 'Premium',
        rating: foundProfile.rating || 4.8,
        reviewCount: foundProfile.reviewsCount || (foundProfile.reviews ? foundProfile.reviews.length : 12),
        image: foundProfile.avatar || foundProfile.image || "",
        gallery: foundProfile.gallery || [],
        location: foundProfile.location || "Boisar, MH",
        workingHours: "9:00 AM - 8:00 PM",
        views: foundProfile.views || 142,
        services: (foundProfile.services || []).map((s: any, idx: number) => typeof s === 'string' ? { id: idx, name: s } : s),
        products: foundProfile.products || [],
        faqs: [],
        reviews: (foundProfile.reviews || []).map((r: any, idx: number) => ({
          id: idx,
          userName: r.user || r.userName || 'Local Customer',
          rating: r.rating || 5,
          comment: r.comment || 'Great experience!',
          createdAt: new Date().toISOString()
        })),
        listingType: foundProfile.listingType || 'agent',
        videos: foundProfile.videos || []
      });
    }

    return NextResponse.json({ error: 'Business profile not found' }, { status: 404 });
  } catch (error: any) {
    console.error('Error fetching business detail:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const businessId = parseInt(id);
    const body = await request.json();

    if (isNaN(businessId)) {
      return NextResponse.json({ error: 'Invalid business ID' }, { status: 400 });
    }

    const {
      name,
      description,
      address,
      phone,
      whatsapp,
      website,
      email,
      instagram,
      facebook,
      youtube,
      googleMaps,
      workingHours,
      location,
      subscription,
      premium,
      verified,
      image,
      phoneClicks,
      whatsappClicks,
      directionClicks,
      websiteClicks
    } = body;

    // Build update object based on what was passed
    const data: any = {};
    if (name !== undefined) data.name = name;
    if (description !== undefined) data.description = description;
    if (address !== undefined) data.address = address;
    if (phone !== undefined) data.phone = phone;
    if (whatsapp !== undefined) data.whatsapp = whatsapp;
    if (website !== undefined) data.website = website;
    if (email !== undefined) data.email = email;
    if (instagram !== undefined) data.instagram = instagram;
    if (facebook !== undefined) data.facebook = facebook;
    if (youtube !== undefined) data.youtube = youtube;
    if (googleMaps !== undefined) data.googleMaps = googleMaps;
    if (workingHours !== undefined) data.workingHours = workingHours;
    if (location !== undefined) data.location = location;
    if (image !== undefined || body.gallery !== undefined) {
      const existing = await prisma.business.findUnique({ where: { id: businessId } });
      const currentParts = existing?.image.split('||gallery_sep||') || [];
      
      let currentCover = currentParts[0] || '';
      if (image !== undefined) {
        currentCover = await uploadImage(image) || '';
      }
      
      let currentGallery = currentParts.slice(1);
      if (body.gallery !== undefined) {
        currentGallery = await uploadGallery(body.gallery);
      }
      
      data.image = [currentCover, ...currentGallery].join('||gallery_sep||');
    }
    if (subscription !== undefined) {
      data.subscription = subscription;
      // Auto toggle premium if subscription is upgraded
      data.premium = ['Silver', 'Gold', 'Premium', 'Enterprise'].includes(subscription);
    }
    if (premium !== undefined) data.premium = premium;
    if (verified !== undefined) data.verified = verified;
    
    // Support setting or incrementing clicks & views
    if (body.views !== undefined) data.views = body.views;
    if (phoneClicks !== undefined) data.phoneClicks = phoneClicks;
    if (whatsappClicks !== undefined) data.whatsappClicks = whatsappClicks;
    if (directionClicks !== undefined) data.directionClicks = directionClicks;
    if (websiteClicks !== undefined) data.websiteClicks = websiteClicks;

    const updated = await prisma.business.update({
      where: { id: businessId },
      data,
      include: {
        services: true,
        products: true,
        faqs: true
      }
    });

    const parts = updated.image.split('||gallery_sep||');
    const result = {
      ...updated,
      image: parts[0],
      gallery: parts.slice(1)
    };
    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Error updating business:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const businessId = parseInt(id);

    if (isNaN(businessId)) {
      return NextResponse.json({ error: 'Invalid business ID' }, { status: 400 });
    }

    // Delete related records
    await prisma.review.deleteMany({ where: { businessId } });
    await prisma.service.deleteMany({ where: { businessId } });
    await prisma.product.deleteMany({ where: { businessId } });
    await prisma.fAQ.deleteMany({ where: { businessId } });
    await prisma.lead.deleteMany({ where: { businessId } });
    await prisma.adOrder.deleteMany({ where: { businessId } });

    // Delete the business itself
    await prisma.business.delete({ where: { id: businessId } });

    return NextResponse.json({ message: 'Business deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting business:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
