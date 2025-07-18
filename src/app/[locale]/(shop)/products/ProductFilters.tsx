'use client'

interface ProductFiltersProps {
  categories: string[]
  onCategoryChange: (category: string) => void
  onSortChange: (sort: 'price_asc' | 'price_desc' | 'rating' | 'newest') => void
  selectedCategory: string
  sortBy: string
}

export function ProductFilters({ 
  categories, 
  onCategoryChange, 
  onSortChange, 
  selectedCategory, 
  sortBy 
}: ProductFiltersProps) {
  return (
    <div className="flex flex-col md:flex-row gap-4 mb-8">
      <div className="flex-1">
        <label className="block text-sm font-medium text-zinc-300 mb-2">カテゴリー</label>
        <select
          value={selectedCategory}
          onChange={(e) => onCategoryChange(e.target.value)}
          className="w-full px-3 py-2 bg-slate-700/70 backdrop-blur-sm border border-slate-600 rounded-md text-slate-100 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
        >
          <option value="all">すべて</option>
          {categories.map((category) => (
            <option key={category} value={category} className="bg-slate-700">
              {category}
            </option>
          ))}
        </select>
      </div>
      
      <div className="flex-1">
        <label className="block text-sm font-medium text-zinc-300 mb-2">並び順</label>
        <select
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value as any)}
          className="w-full px-3 py-2 bg-slate-700/70 backdrop-blur-sm border border-slate-600 rounded-md text-slate-100 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
        >
          <option value="newest" className="bg-slate-700">新着順</option>
          <option value="price_asc" className="bg-slate-700">価格: 安い順</option>
          <option value="price_desc" className="bg-slate-700">価格: 高い順</option>
          <option value="rating" className="bg-slate-700">評価順</option>
        </select>
      </div>
    </div>
  )
}