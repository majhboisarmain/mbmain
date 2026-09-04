import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { uploadGallery, uploadImage } from '@/lib/cloudinary';
import { internalServerErrorResponse, badRequestResponse } from '@/lib/authGuard';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const forAction = searchParams.get('forAction'); // Sale or Rent
    const propertyType = searchParams.get('propertyType');
    const location = searchParams.get('location');
    const all = searchParams.get('all') === 'true';
    const phone = searchParams.get('phone');

    const where: any = {};
    if (!all) {
      if (phone) {
        // User querying their own properties
        const last7 = phone.replace(/\D/g, '').slice(-7);
        where.OR = [
          { contactPhone: { contains: last7 } },
          { whatsappPhone: { contains: last7 } }
        ];
      } else {
        // Public visitor only sees admin-verified approved properties
        where.verified = true;
      }
    }

    if (forAction) {
      where.forAction = forAction;
    }
    if (propertyType && propertyType !== 'All Types') {
      where.propertyType = { contains: propertyType };
    }
    if (location && location !== 'All') {
      where.addressLocality = { contains: location };
    }

    const properties = await prisma.propertyListing.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    const result = properties.map(p => {
      const rawParts = (p.images || '').split('||gallery_sep||').filter(Boolean);
      const photoParts = rawParts.filter(part => !part.startsWith('video:') && !part.match(/\.(mp4|webm|mov|mkv)(\?.*)?$/i) && !part.includes('/video/upload/') && !part.startsWith('data:video/'));
      const videoParts = rawParts
        .filter(part => part.startsWith('video:') || part.match(/\.(mp4|webm|mov|mkv)(\?.*)?$/i) || part.includes('/video/upload/') || part.startsWith('data:video/'))
        .map(part => part.replace(/^video:/, ''));

      return {
        ...p,
        category: `${p.bedrooms ? `${p.bedrooms} BHK ` : ''}${p.propertyType} for ${p.forAction}`,
        location: p.addressLocality,
        avatar: photoParts[0] || 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&q=80',
        gallery: photoParts.length > 0 ? photoParts : (rawParts.length > 0 && videoParts.length === 0 ? rawParts : []),
        videos: videoParts,
        video: videoParts[0] || null,
        listingType: 'property',
        bio: p.description,
        name: p.contactName,
        phone: p.contactPhone,
        whatsapp: p.whatsappPhone || p.contactPhone,
        verified: p.verified,
        isSold: Boolean(p.isSold),
        isFeatured: Boolean(p.isFeatured),
        mapUrl: p.mapUrl || null
      };
    });

    return NextResponse.json(result);
  } catch (error: any) {
    return internalServerErrorResponse('/api/properties GET', error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      iAm, contactName, contactPhone, whatsappPhone, forAction,
      propertyType, cityName, projectName, addressLocality, bedrooms,
      balconies, furnishing, bathrooms, carpetArea, superArea, price,
      description, photos, video, videos, mapUrl
    } = body;

    if (!contactName || !contactPhone || !price || !addressLocality) {
      return badRequestResponse('Contact Name, Contact Phone, Locality, and Price are required.');
    }

    let galleryUrls: string[] = [];
    if (Array.isArray(photos) && photos.length > 0) {
      galleryUrls = await uploadGallery(photos);
    }

    let uploadedVideoUrl: string | null = null;
    const rawVideo = video || (Array.isArray(videos) && videos[0] ? videos[0] : null);
    if (rawVideo) {
      uploadedVideoUrl = await uploadImage(rawVideo);
    }

    const allMediaToStore = [...galleryUrls];
    if (uploadedVideoUrl) {
      allMediaToStore.push(`video:${uploadedVideoUrl}`);
    }

    const property = await prisma.propertyListing.create({
      data: {
        iAm: iAm || 'Owner',
        contactName,
        contactPhone,
        whatsappPhone: whatsappPhone || contactPhone,
        forAction: forAction || 'Sale',
        propertyType: propertyType || 'Flat/ Apartment',
        cityName: cityName || 'Boisar',
        projectName: projectName || null,
        addressLocality,
        bedrooms: bedrooms || null,
        balconies: balconies || null,
        furnishing: furnishing || null,
        bathrooms: bathrooms || null,
        carpetArea: carpetArea || null,
        superArea: superArea || null,
        price,
        description: description || null,
        images: allMediaToStore.join('||gallery_sep||'),
        mapUrl: mapUrl ? mapUrl.trim() : null,
        verified: false, // Requires Super Admin approval before going live
        isSold: false,
        isFeatured: false
      },
    });

    const rawParts = (property.images || '').split('||gallery_sep||').filter(Boolean);
    const photoParts = rawParts.filter(part => !part.startsWith('video:') && !part.match(/\.(mp4|webm|mov|mkv)(\?.*)?$/i) && !part.includes('/video/upload/') && !part.startsWith('data:video/'));
    const videoParts = rawParts
      .filter(part => part.startsWith('video:') || part.match(/\.(mp4|webm|mov|mkv)(\?.*)?$/i) || part.includes('/video/upload/') || part.startsWith('data:video/'))
      .map(part => part.replace(/^video:/, ''));

    const result = {
      ...property,
      category: `${property.bedrooms ? `${property.bedrooms} BHK ` : ''}${property.propertyType} for ${property.forAction}`,
      location: property.addressLocality,
      avatar: photoParts[0] || 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&q=80',
      gallery: photoParts.length > 0 ? photoParts : (rawParts.length > 0 && videoParts.length === 0 ? rawParts : []),
      videos: videoParts,
      video: videoParts[0] || null,
      listingType: 'property',
      bio: property.description,
      name: property.contactName,
      phone: property.contactPhone,
      whatsapp: property.whatsappPhone || property.contactPhone,
      verified: false,
      isSold: false,
      isFeatured: false,
      mapUrl: property.mapUrl || null
    };

    return NextResponse.json(result, { status: 201 });
  } catch (error: any) {
    return internalServerErrorResponse('/api/properties POST', error);
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return badRequestResponse('Property ID is required');

    const body = await request.json();
    const updated = await prisma.propertyListing.update({
      where: { id: parseInt(id) },
      data: {
        ...(body.verified !== undefined && { verified: body.verified }),
        ...(body.isSold !== undefined && { isSold: body.isSold }),
        ...(body.isFeatured !== undefined && { isFeatured: body.isFeatured }),
        ...(body.price !== undefined && { price: body.price }),
        ...(body.description !== undefined && { description: body.description }),
        ...(body.mapUrl !== undefined && { mapUrl: body.mapUrl ? body.mapUrl.trim() : null }),
      }
    });

    return NextResponse.json({
      ...updated,
      isSold: Boolean(updated.isSold),
      isFeatured: Boolean(updated.isFeatured),
      mapUrl: updated.mapUrl || null
    });
  } catch (error: any) {
    return internalServerErrorResponse('/api/properties PUT', error);
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return badRequestResponse('Property ID is required');

    await prisma.propertyListing.delete({
      where: { id: parseInt(id) },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return internalServerErrorResponse('/api/properties DELETE', error);
  }
}
