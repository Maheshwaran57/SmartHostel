import React from 'react';
import { Badge } from './Badge';

export const StatusBadge = ({ status }) => {
  const maps = {
    pending: { label: 'Pending', variant: 'warning' },
    assigned: { label: 'Assigned', variant: 'info' },
    'in-progress': { label: 'In Progress', variant: 'warning' },
    resolved: { label: 'Resolved', variant: 'success' },
    available: { label: 'Available', variant: 'success' },
    partial: { label: 'Partial', variant: 'warning' },
    full: { label: 'Full', variant: 'danger' },
    maintenance: { label: 'Maintenance', variant: 'danger' }
  };

  const current = maps[status.toLowerCase()] || { label: status, variant: 'default' };

  return <Badge variant={current.variant}>{current.label}</Badge>;
};