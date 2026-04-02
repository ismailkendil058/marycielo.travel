import { useState } from 'react';
import { X } from 'lucide-react';
import { addBooking } from '@/lib/store';
import { toast } from 'sonner';

interface BookingModalProps {
  service: string;
  destination: string;
  onClose: () => void;
}

const BookingModal = ({ service, destination, onClose }: BookingModalProps) => {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !phone.trim()) return;
    setSubmitting(true);
    addBooking({ full_name: fullName.trim(), phone: phone.trim(), service, destination });
    setTimeout(() => {
      setSubmitting(false);
      toast.success('Demande envoyée avec succès ! / تم إرسال طلبك بنجاح');
      onClose();
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-foreground/60" onClick={onClose}>
      <div
        className="bg-background w-full sm:max-w-md rounded-t-lg sm:rounded-lg p-6 sm:p-8 relative max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground" aria-label="Fermer">
          <X className="w-5 h-5" />
        </button>

        <h3 className="font-display text-2xl text-foreground mb-1">Réserver maintenant</h3>
        <p className="font-arabic text-sm text-muted-foreground mb-6" dir="rtl">احجز الآن</p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="font-body text-xs tracking-wider uppercase text-muted-foreground mb-1 block">
              Nom complet / الاسم الكامل
            </label>
            <input
              type="text"
              value={fullName}
              onChange={e => setFullName(e.target.value)}
              required
              maxLength={100}
              className="w-full border border-border bg-background px-4 py-3 font-body text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              placeholder="Votre nom complet"
            />
          </div>
          <div>
            <label className="font-body text-xs tracking-wider uppercase text-muted-foreground mb-1 block">
              Numéro de téléphone / رقم الهاتف
            </label>
            <input
              type="tel"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              required
              maxLength={20}
              className="w-full border border-border bg-background px-4 py-3 font-body text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              placeholder="+213 XXX XXX XXX"
            />
          </div>

          <div className="text-xs text-muted-foreground font-body space-y-1">
            <p><span className="font-medium">Service:</span> {service}</p>
            <p><span className="font-medium">Destination:</span> {destination}</p>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="btn-primary w-full text-center disabled:opacity-50"
          >
            {submitting ? '...' : 'Envoyer ma demande'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default BookingModal;
