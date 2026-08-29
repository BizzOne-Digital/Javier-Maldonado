import { connectDB } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-auth";
import { apiSuccess, handleApiError } from "@/lib/api-utils";
import Listing from "@/models/Listing";
import Lead from "@/models/Lead";
import Booking from "@/models/Booking";
import Testimonial from "@/models/Testimonial";
import TeamMember from "@/models/TeamMember";
import Resource from "@/models/Resource";
import Service from "@/models/Service";

export async function GET() {
  try {
    const { admin, error } = await requireAdmin();
    if (!admin) return error!;

    await connectDB();

    const [
      totalListings,
      publishedListings,
      newLeads,
      totalLeads,
      pendingBookings,
      totalBookings,
      publishedTestimonials,
      publishedTeam,
      publishedResources,
      publishedServices,
      recentLeads,
      recentBookings,
    ] = await Promise.all([
      Listing.countDocuments(),
      Listing.countDocuments({ published: true }),
      Lead.countDocuments({ status: "new" }),
      Lead.countDocuments(),
      Booking.countDocuments({ status: "pending" }),
      Booking.countDocuments(),
      Testimonial.countDocuments({ published: true }),
      TeamMember.countDocuments({ published: true }),
      Resource.countDocuments({ published: true }),
      Service.countDocuments({ published: true }),
      Lead.find().sort({ createdAt: -1 }).limit(5).lean(),
      Booking.find().sort({ createdAt: -1 }).limit(5).lean(),
    ]);

    return apiSuccess({
      stats: {
        listings: { total: totalListings, published: publishedListings },
        leads: { total: totalLeads, new: newLeads },
        bookings: { total: totalBookings, pending: pendingBookings },
        testimonials: { published: publishedTestimonials },
        team: { published: publishedTeam },
        resources: { published: publishedResources },
        services: { published: publishedServices },
      },
      recentLeads,
      recentBookings,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
