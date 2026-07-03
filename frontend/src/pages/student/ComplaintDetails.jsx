import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { complaintService } from '../../services/complaintService';
import { Card } from '../../components/common/Card';
import { Timeline } from '../../components/common/Timeline';
import { StatusBadge } from '../../components/common/StatusBadge';
import { LoadingSkeleton } from '../../components/common/LoadingSkeleton';

export const ComplaintDetails = () => {
  const { id } = useParams();
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchComplaint = async () => {
      try {
        const res = await complaintService.getComplaint(id);
        if (res.data.success) {
          setComplaint(res.data.complaint);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchComplaint();
  }, [id]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Complaint Timeline</h2>
        <p className="text-sm text-gray-500 mt-1">Track status updates and history of your issue.</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2"><LoadingSkeleton variant="card" count={1} /></div>
          <div><LoadingSkeleton variant="card" count={1} /></div>
        </div>
      ) : !complaint ? (
        <Card className="text-center py-12 text-slate-500">
          Complaint details not found.
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card title="Complaint Details" className="md:col-span-2 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">{complaint.title}</h3>
            <StatusBadge status={complaint.status} />
          </div>

          <p className="text-sm text-gray-600 dark:text-gray-300 whitespace-pre-line">{complaint.description}</p>

          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-surface-200 dark:border-surface-700 text-xs">
            <div>
              <p className="font-semibold text-gray-550">Category</p>
              <p className="text-sm font-semibold capitalize mt-1 text-gray-800 dark:text-white">{complaint.category}</p>
            </div>
            <div>
              <p className="font-semibold text-gray-550">Priority</p>
              <p className="text-sm font-semibold capitalize mt-1 text-gray-800 dark:text-white">{complaint.priority}</p>
            </div>
          </div>

          {complaint.images?.length > 0 && (
            <div className="pt-4 border-t border-surface-200 dark:border-surface-700">
              <p className="text-xs font-semibold text-gray-500 mb-2">Complaint Images</p>
              <div className="flex flex-wrap gap-2">
                {complaint.images.map((img, idx) => (
                  <img key={idx} src={img} alt="issue" className="h-24 w-24 object-cover rounded-lg border dark:border-surface-700" />
                ))}
              </div>
            </div>
          )}

          {complaint.resolutionNotes && (
            <div className="pt-4 border-t border-surface-200 dark:border-surface-700 bg-emerald-50/20 p-4 rounded-xl">
              <p className="text-xs font-bold text-emerald-600 uppercase">Resolution Notes</p>
              <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">{complaint.resolutionNotes}</p>
              {complaint.resolutionImage && (
                <img src={complaint.resolutionImage} alt="resolution" className="h-32 object-cover rounded-lg mt-3" />
              )}
            </div>
          )}
        </Card>

        <Card title="Activity Timeline">
          <Timeline items={complaint.timeline} />
        </Card>
        </div>
      )}
    </div>
  );
};

export default ComplaintDetails;