import { useState } from 'react';
import { useContactSubmissions, useDeleteContactSubmission } from '@/hooks/useContact';
import { format } from 'date-fns';
import { Trash2, Mail } from 'lucide-react';

export function ContactPage() {
  const [page, setPage] = useState(1);
  const [read, setRead] = useState<boolean | undefined>();
  const { data, isLoading } = useContactSubmissions(page, 10, read);
  const deleteMutation = useDeleteContactSubmission();

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Contact Messages</h1>
      </div>

      {/* Filter */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <select
          value={read === undefined ? '' : read ? 'true' : 'false'}
          onChange={(e) => {
            if (e.target.value === '') {
              setRead(undefined);
            } else {
              setRead(e.target.value === 'true');
            }
            setPage(1);
          }}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Messages</option>
          <option value="false">Unread</option>
          <option value="true">Read</option>
        </select>
      </div>

      {/* Messages Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Name</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Email</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Phone</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Message</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Date</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                  Loading...
                </td>
              </tr>
            ) : data?.data?.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                  No messages found
                </td>
              </tr>
            ) : (
              data?.data?.map((submission: any) => (
                <tr key={submission.id} className={`border-b hover:bg-gray-50 ${!submission.read ? 'bg-blue-50' : ''}`}>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{submission.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{submission.email}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{submission.phone}</td>
                  <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">
                    {submission.message}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {format(new Date(submission.createdAt), 'MMM dd, yyyy')}
                  </td>
                  <td className="px-6 py-4 text-sm gap-2 flex">
                    <a
                      href={`mailto:${submission.email}`}
                      className="text-blue-600 hover:text-blue-800 p-1"
                      title="Reply"
                    >
                      <Mail size={18} />
                    </a>
                    <button
                      onClick={() => deleteMutation.mutate(submission.id)}
                      className="text-red-600 hover:text-red-800 p-1"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="mt-6 flex justify-center gap-2">
        {Array.from({ length: data?.pagination?.pages || 1 }).map((_, i) => (
          <button
            key={i + 1}
            onClick={() => setPage(i + 1)}
            className={`px-4 py-2 rounded-lg transition ${
              page === i + 1
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-900 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
}
