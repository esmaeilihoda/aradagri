import { useState } from 'react';
import { useCategoryTree, useCreateCategory, useDeleteCategory } from '@/hooks/useCategories';
import { Plus, Trash2, ChevronRight } from 'lucide-react';

export function CategoriesPage() {
  const { data: categories } = useCategoryTree();
  const createMutation = useCreateCategory();
  const deleteMutation = useDeleteCategory();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const [formData, setFormData] = useState({
    name: '',
    parentId: '',
    description: '',
  });

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createMutation.mutateAsync(formData);
      setFormData({ name: '', parentId: '', description: '' });
      setIsFormOpen(false);
    } catch (error) {
      console.error(error);
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const renderCategory = (category: any, level: number = 0) => (
    <div key={category.id}>
      <div className="flex items-center gap-2 p-3 hover:bg-gray-50 border-b cursor-pointer">
        {category.children?.length > 0 && (
          <button
            onClick={() => toggleExpand(category.id)}
            className="p-1"
          >
            <ChevronRight
              size={18}
              className={`transition ${expandedIds.has(category.id) ? 'rotate-90' : ''}`}
            />
          </button>
        )}
        <div style={{ marginLeft: `${level * 20}px` }} className="flex-1">
          <p className="font-medium text-gray-900">{category.name}</p>
          {category.description && (
            <p className="text-sm text-gray-600">{category.description}</p>
          )}
        </div>
        <button
          onClick={() => deleteMutation.mutate(category.id)}
          className="text-red-600 hover:text-red-800 p-1"
        >
          <Trash2 size={18} />
        </button>
      </div>
      {expandedIds.has(category.id) &&
        category.children?.map((child: any) => renderCategory(child, level + 1))}
    </div>
  );

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Categories</h1>
        <button
          onClick={() => setIsFormOpen(!isFormOpen)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition"
        >
          <Plus size={20} />
          New Category
        </button>
      </div>

      {/* Form */}
      {isFormOpen && (
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">Add New Category</h2>
          <form onSubmit={handleCreate} className="space-y-4">
            <input
              type="text"
              placeholder="Category Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <textarea
              placeholder="Description (optional)"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              disabled={createMutation.isPending}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg transition"
            >
              {createMutation.isPending ? 'Creating...' : 'Create Category'}
            </button>
          </form>
        </div>
      )}

      {/* Categories Tree */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {categories?.length === 0 ? (
          <div className="p-6 text-center text-gray-500">No categories found</div>
        ) : (
          categories?.map((category: any) => renderCategory(category))
        )}
      </div>
    </div>
  );
}
