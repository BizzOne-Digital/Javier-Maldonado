"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useLocale } from "next-intl";
import type { Listing, ListingFiltersState } from "@/types/listing";
import { siteConfig } from "@/config/site";
import { useLabels } from "@/lib/labels";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

interface ListingFiltersProps {
  open: boolean;
  onClose: () => void;
  filters: ListingFiltersState;
  onApply: (filters: ListingFiltersState) => void;
  listings: Listing[];
}

export function ListingFilters({
  open,
  onClose,
  filters,
  onApply,
  listings,
}: ListingFiltersProps) {
  const locale = useLocale();
  const t = useLabels(locale as "en" | "es");
  const cities = [...new Set([...siteConfig.serviceAreas, ...listings.map((l) => l.city)])];
  const propertyTypes = [...new Set(listings.map((l) => l.propertyType))];

  const fieldClass =
    "w-full rounded-xl border border-champagne/30 bg-ivory px-4 py-3 text-midnight focus:border-lake focus:outline-none";

  const update = (patch: Partial<ListingFiltersState>) => {
    onApply({ ...filters, ...patch });
  };

  const clear = () => {
    onApply({ status: "all" });
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-50 bg-midnight/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.aside
            className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-ivory shadow-2xl flex flex-col"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 300 }}
          >
            <div className="flex items-center justify-between p-6 border-b border-champagne/20">
              <h2 className="font-display text-2xl text-midnight">{t("listings.filters")}</h2>
              <button type="button" onClick={onClose} className="p-2 text-slate hover:text-midnight">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate mb-2">{t("forms.city")}</label>
                <select
                  value={filters.city || ""}
                  onChange={(e) => update({ city: e.target.value || undefined })}
                  className={fieldClass}
                >
                  <option value="">{locale === "es" ? "Todas" : "All"}</option>
                  {cities.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate mb-2">Status</label>
                <select
                  value={filters.status || "all"}
                  onChange={(e) =>
                    update({ status: e.target.value as ListingFiltersState["status"] })
                  }
                  className={fieldClass}
                >
                  <option value="all">{locale === "es" ? "Todos" : "All"}</option>
                  <option value="for_sale">{t("listings.forSale")}</option>
                  <option value="for_lease">{t("listings.forLease")}</option>
                  <option value="sold">{t("listings.sold")}</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate mb-2">Min $</label>
                  <input
                    type="number"
                    value={filters.minPrice || ""}
                    onChange={(e) =>
                      update({ minPrice: e.target.value ? Number(e.target.value) : undefined })
                    }
                    className={fieldClass}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate mb-2">Max $</label>
                  <input
                    type="number"
                    value={filters.maxPrice || ""}
                    onChange={(e) =>
                      update({ maxPrice: e.target.value ? Number(e.target.value) : undefined })
                    }
                    className={fieldClass}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate mb-2">{t("forms.bedrooms")}</label>
                <select
                  value={filters.bedrooms || ""}
                  onChange={(e) =>
                    update({ bedrooms: e.target.value ? Number(e.target.value) : undefined })
                  }
                  className={fieldClass}
                >
                  <option value="">Any</option>
                  {[1, 2, 3, 4, 5].map((n) => (
                    <option key={n} value={n}>
                      {n}+
                    </option>
                  ))}
                </select>
              </div>

              {propertyTypes.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-slate mb-2">
                    {t("forms.propertyType")}
                  </label>
                  <select
                    value={filters.propertyType || ""}
                    onChange={(e) => update({ propertyType: e.target.value || undefined })}
                    className={fieldClass}
                  >
                    <option value="">Any</option>
                    {propertyTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            <div className={cn("p-6 border-t border-champagne/20 flex gap-3")}>
              <Button variant="outline" onClick={clear} className="flex-1">
                {t("listings.clear")}
              </Button>
              <Button onClick={onClose} magnetic className="flex-1">
                {t("listings.apply")}
              </Button>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
