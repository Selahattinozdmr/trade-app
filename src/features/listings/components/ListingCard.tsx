import { CATEGORIES, CITIES } from "@/lib/constants";
import type { Item } from "@/types/app";

type Props = {
  item: Item;
};

export function ItemCard({ item }: Props) {
  const getCategoryLabel = (value?: string) => {
    if (!value) return "Kategori Yok";
    return CATEGORIES.find((cat) => cat.value === value)?.label || value;
  };

  const getCityLabel = (value?: string) => {
    if (!value) return "Şehir Yok";
    return CITIES.find((city) => city.value === value)?.label || value;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("tr-TR", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow cursor-pointer group">
      {/* Image */}
      <div className="relative aspect-[4/3] bg-gray-100">
        {item.image_url ? (
          <img
            src={item.image_url}
            alt={item.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <svg
              className="w-12 h-12"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
        )}

        {/* Deal badge */}
        {item.is_deal && (
          <div className="absolute top-3 right-3">
            <span className="px-2 py-1 text-xs font-medium rounded-full bg-orange-100 text-orange-800">
              Fırsat
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-lg text-gray-900 mb-2 line-clamp-2 group-hover:text-orange-600 transition-colors">
          {item.title}
        </h3>

        {item.description && (
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
            {item.description}
          </p>
        )}

        {/* Location and Category */}
        <div className="flex items-center gap-4 mb-3 text-sm text-gray-500">
          <div className="flex items-center gap-1">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <span>{getCityLabel(item.city)}</span>
          </div>

          <div className="flex items-center gap-1">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
              />
            </svg>
            <span>{getCategoryLabel(item.category)}</span>
          </div>
        </div>

        {/* Date */}
        <div className="flex justify-end">
          <div className="text-xs text-gray-400">
            {formatDate(item.created_at)}
          </div>
        </div>
      </div>
    </div>
  );
}
