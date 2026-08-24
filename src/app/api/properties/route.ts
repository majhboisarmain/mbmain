import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { uploadGallery } from '@/lib/cloudinary';
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
      const parts = (p.images || '').split('||gallery_sep||').filter(Boolean);
      return {
        ...p,
        category: `${p.bedrooms ? `${p.bedrooms} BHK ` : ''}${p.propertyType} for ${p.forAction}`,
        location: p.addressLocality,
        avatar: parts[0] || 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&q=80',
        gallery: parts,
        listingType: 'property',
        bio: p.description,
        name: p.contactName,
        phone: p.contactPhone,
        whatsapp: p.whatsappPhone || p.contactPhone,
        verified: p.verified
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
      description, photos
    } = body;

    if (!contactName || !contactPhone || !price || !addressLocality) {
      return badRequestResponse('Contact Name, Contact Phone, Locality, and Price are required.');
    }

    let galleryUrls: string[] = [];
    if (Array.isArray(photos) && photos.length > 0) {
      galleryUrls = await uploadGallery(photos);
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
        images: galleryUrls.join('||gallery_sep||'),
        verified: false // Requires Super Admin approval before going live
      },
    });

    const parts = (property.images || '').split('||gallery_sep||').filter(Boolean);
    const result = {
      ...property,
      category: `${property.bedrooms ? `${property.bedrooms} BHK ` : ''}${property.propertyType} for ${property.forAction}`,
      location: property.addressLocality,
      avatar: parts[0] || 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&q=80',
      gallery: parts,
      listingType: 'property',
      bio: property.description,
      name: property.contactName,
      phone: property.contactPhone,
      whatsapp: property.whatsappPhone || property.contactPhone,
      verified: false
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
        ...(body.price !== undefined && { price: body.price }),
        ...(body.description !== undefined && { description: body.description }),
      }
    });

    return NextResponse.json(updated);
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
