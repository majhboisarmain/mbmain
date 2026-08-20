'use client';

import React from 'react';
import BusTimetableModal from './BusTimetableModal';

interface TrainTimetableModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function TrainTimetableModal({ isOpen, onClose }: TrainTimetableModalProps) {
  return <BusTimetableModal isOpen={isOpen} onClose={onClose} />;
}

