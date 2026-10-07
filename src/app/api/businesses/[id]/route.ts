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

    // 1. First try finding in Prisma Database (by ID or by Slug)
    try {
      const business = await prisma.business.findFirst({
        where: !isNaN(businessId) ? { id: businessId } : { slug: id },
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
            where: { id: business.id },
            data: { views: { increment: 1 } }
          }).catch(() => {});
        }

        const parts = (business.image || '').split('||gallery_sep||');
        
        const isManage = request.nextUrl.searchParams.get('manage') === 'true';
        const sub = business.subscription || 'Free';
        const isPaidActive = Boolean(business.premium && sub !== 'Free');
        const allowedCatalogLimit = isPaidActive 
          ? (sub === 'Starter' || sub === 'Basic' ? 25 : 9999) 
          : 5;

        const publicProducts = (business.products || []).slice(0, isManage ? undefined : allowedCatalogLimit);
        const publicServices = (business.services || []).slice(0, isManage ? undefined : allowedCatalogLimit);

        return NextResponse.json({
          ...business,
          image: parts[0] || "",
          gallery: parts.slice(1),
          products: publicProducts,
          services: publicServices,
          allProducts: business.products || [],
          allServices: business.services || [],
          totalProductsCount: (business.products || []).length,
          totalServicesCount: (business.services || []).length,
          catalogLimit: allowedCatalogLimit,
          isPaidActive
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
    let targetId = parseInt(id);
    if (isNaN(targetId)) {
      const b = await prisma.business.findUnique({ where: { slug: id }, select: { id: true } });
      if (b) targetId = b.id;
    }
    const body = await request.json();

    if (!targetId || isNaN(targetId)) {
      return NextResponse.json({ error: 'Invalid business ID' }, { status: 400 });
    }
    const businessId = targetId;

    const {
      name,
      category,
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

    const PROTECTED_HOMEPAGE_SERVICES = [
      'Home Loan',
      'Personal Loan',
      'Business Loan',
      'Gold Loan',
      'Vehicle Loan',
      'Education Loan',
      'Health Insurance',
      'Life Insurance',
      'Vehicle Insurance',
      'Home Insurance',
      'Travel Insurance',
      'Shop & Commercial Insurance'
    ];

    const isAdmin = body.isAdmin === true;

    // Build update object based on what was passed
    const data: any = {};
    if (name !== undefined) data.name = name;
    if (category !== undefined) {
      let finalCat = category;
      // If not admin, protect homepage loan/insurance categories from direct self-assignment
      if (!isAdmin) {
        const isProtectedLoan = ['home loan', 'personal loan', 'business loan', 'gold loan', 'vehicle loan', 'education loan'].includes((category || '').toLowerCase());
        const isProtectedIns = ['health insurance', 'life insurance', 'vehicle insurance', 'home insurance', 'travel insurance', 'shop & commercial insurance'].includes((category || '').toLowerCase());
        if (isProtectedLoan) finalCat = 'Loan Consultants';
        else if (isProtectedIns) finalCat = 'Insurance Agents';
      }
      data.category = finalCat;
    }
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
    if (image !== undefined || body.coverImage !== undefined || body.gallery !== undefined) {
      const existing = await prisma.business.findUnique({ where: { id: businessId } });
      const currentParts = existing?.image ? existing.image.split('||gallery_sep||') : [];
      
      let currentLogo = currentParts[0] || '';
      if (image !== undefined) {
        currentLogo = (await uploadImage(image)) || currentLogo;
      }

      let currentCover = currentParts[1] || '';
      if (body.coverImage !== undefined) {
        currentCover = (await uploadImage(body.coverImage)) || currentCover;
      }
      
      let currentGallery = currentParts.slice(2);
      if (body.gallery !== undefined) {
        const uploaded = await uploadGallery(body.gallery);
        currentGallery = uploaded.filter((img: string) => img !== currentLogo && img !== currentCover);
      }
      
      const assembled = [currentLogo];
      if (currentCover) assembled.push(currentCover);
      if (currentGallery.length > 0) assembled.push(...currentGallery);

      data.image = assembled.filter(Boolean).join('||gallery_sep||');
    }
    if (subscription !== undefined) {
      data.subscription = subscription;
      // Auto toggle premium if subscription is upgraded
      data.premium = ['Silver', 'Gold', 'Premium', 'Enterprise'].includes(subscription);
    }
    if (premium !== undefined) data.premium = premium;
    if (verified !== undefined) data.verified = verified;
    if (body.hasHomeDelivery !== undefined) data.hasHomeDelivery = body.hasHomeDelivery === true || body.hasHomeDelivery === 'true';
    
    // Support setting or incrementing clicks & views
    if (body.views !== undefined) data.views = body.views;
    if (phoneClicks !== undefined) data.phoneClicks = phoneClicks;
    if (whatsappClicks !== undefined) data.whatsappClicks = whatsappClicks;
    if (directionClicks !== undefined) data.directionClicks = directionClicks;
    if (websiteClicks !== undefined) data.websiteClicks = websiteClicks;

    // Admin: assign/update business owner phone (used for dashboard login)
    if (body.createdBy !== undefined) data.createdBy = body.createdBy ? body.createdBy.toString().replace(/\D/g, '').slice(-10) : null;

    // Sync services if provided
    if (body.services !== undefined && Array.isArray(body.services)) {
      let validServices = body.services
        .map((s: any) => typeof s === 'string' ? s.trim() : (s?.name || '').trim())
        .filter(Boolean);

      // If not admin, do not allow regular businesses to self-assign protected homepage loan/insurance services
      if (!isAdmin) {
        const existingServices = await prisma.service.findMany({ where: { businessId } });
        const existingProtected = existingServices
          .filter(s => PROTECTED_HOMEPAGE_SERVICES.some(p => p.toLowerCase() === s.name.toLowerCase()))
          .map(s => s.name);

        validServices = validServices.filter((s: string) => {
          const isProtected = PROTECTED_HOMEPAGE_SERVICES.some(p => p.toLowerCase() === s.toLowerCase());
          if (!isProtected) return true;
          return existingProtected.some(ep => ep.toLowerCase() === s.toLowerCase());
        });
      }

      await prisma.service.deleteMany({ where: { businessId } });
      if (validServices.length > 0) {
        await prisma.service.createMany({
          data: validServices.map((name: string) => ({
            businessId,
            name
          }))
        });
      }
    }

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
    let targetId = parseInt(id);
    if (isNaN(targetId)) {
      const b = await prisma.business.findUnique({ where: { slug: id }, select: { id: true } });
      if (b) targetId = b.id;
    }

    if (!targetId || isNaN(targetId)) {
      return NextResponse.json({ error: 'Invalid business ID' }, { status: 400 });
    }
    const businessId = targetId;

    // Delete related records safely
    await prisma.jobApplication.deleteMany({ where: { job: { businessId } } }).catch(() => {});
    await prisma.job.deleteMany({ where: { businessId } }).catch(() => {});
    await prisma.review.deleteMany({ where: { businessId } }).catch(() => {});
    await prisma.service.deleteMany({ where: { businessId } }).catch(() => {});
    await prisma.product.deleteMany({ where: { businessId } }).catch(() => {});
    await prisma.fAQ.deleteMany({ where: { businessId } }).catch(() => {});
    await prisma.lead.deleteMany({ where: { businessId } }).catch(() => {});
    await prisma.adOrder.deleteMany({ where: { businessId } }).catch(() => {});

    // Delete the business itself
    await prisma.business.delete({ where: { id: businessId } });

    return NextResponse.json({ message: 'Business deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting business:', error);
    return NextResponse.json({ error: error.message || 'Failed to delete business' }, { status: 500 });
  }
}
