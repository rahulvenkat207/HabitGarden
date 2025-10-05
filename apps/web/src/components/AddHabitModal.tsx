import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface AddHabitModalProps {
  open: boolean;
  onClose: () => void;
  onCreate: (habit: { name: string; icon: string; frequency: 'daily' | 'weekly' }) => void;
}

const plantIcons = ['🌱', '🌿', '🌵', '🌳', '🌺', '🌻', '🌷', '🌹', '🪴', '🌾'];
const activityIcons = ['📚', '💪', '🧘', '🏃', '✍️', '🎨', '🎵', '🍎', '💧', '😴'];

export const AddHabitModal = ({ open, onClose, onCreate }: AddHabitModalProps) => {
  const [name, setName] = useState('');
  const [icon, setIcon] = useState('🌱');
  const [frequency, setFrequency] = useState<'daily' | 'weekly'>('daily');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    
    onCreate({ name: name.trim(), icon, frequency });
    setName('');
    setIcon('🌱');
    setFrequency('daily');
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Plant a New Habit</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Habit Name</Label>
            <Input
              id="name"
              placeholder="e.g., Morning Meditation"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
            />
          </div>

          <div className="space-y-2">
            <Label>Choose an Icon</Label>
            <div className="grid grid-cols-5 gap-2">
              {[...plantIcons, ...activityIcons].map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => setIcon(emoji)}
                  className={`p-3 text-2xl rounded-lg transition-smooth hover:scale-110 ${
                    icon === emoji
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted hover:bg-muted/80'
                  }`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="frequency">Frequency</Label>
            <Select value={frequency} onValueChange={(v) => setFrequency(v as 'daily' | 'weekly')}>
              <SelectTrigger id="frequency">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-3 justify-end">
            <Button type="button" variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={!name.trim()}>
              Plant Habit
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};