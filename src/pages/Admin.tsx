import { useState, useEffect } from 'react';
import { registerSW } from 'virtual:pwa-register';

import { getBookings, markBookingContacted, getServices, updateService, getDestinations, addDestination, updateDestination, deleteDestination, type Service, type Destination, type Booking } from '@/lib/store';
import { LogOut, Check, Trash2, Plus, Edit2, X, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { compressImage, cn } from '@/lib/utils';

const ADMIN_PASSWORD = 'admin123';

const Admin = () => {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [tab, setTab] = useState<'bookings' | 'services' | 'destinations'>('bookings');
  const [, setRefresh] = useState(0);

  useEffect(() => {
    // Register Service Worker only for Admin
    registerSW({ immediate: true });

    // Dynamically set PWA meta and title only for Admin
    document.title = "ADMIN";

    const setMeta = (name: string, content: string, isLink = false) => {
      const attr = isLink ? 'rel' : 'name';
      let el = document.querySelector(`${isLink ? 'link' : 'meta'}[${attr}="${name}"]`);
      if (!el) {
        el = document.createElement(isLink ? 'link' : 'meta');
        el.setAttribute(attr, name);
        document.head.appendChild(el);
      }
      el.setAttribute(isLink ? 'href' : 'content', content);
    };

    setMeta("apple-mobile-web-app-capable", "yes");
    setMeta("apple-mobile-web-app-status-bar-style", "default");
    setMeta("apple-mobile-web-app-title", "ADMIN");
    setMeta("mobile-web-app-capable", "yes");
    setMeta("apple-touch-icon", "/Screenshot 2026-04-02 230712.png", true);
    setMeta("manifest", "/manifest.webmanifest", true);

    return () => {
      document.title = "marycielo.travel — Admin";
    };
  }, []);


  const forceRefresh = () => setRefresh(r => r + 1);

  if (!authenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-6">
        <form
          onSubmit={e => {
            e.preventDefault();
            if (password === ADMIN_PASSWORD) {
              setAuthenticated(true);
            } else {
              toast.error('Mot de passe incorrect');
            }
          }}
          className="w-full max-w-sm space-y-6"
        >
          <div className="text-center">
            <h1 className="font-display text-3xl text-foreground mb-1">Administration</h1>
            <p className="font-arabic text-sm text-muted-foreground" dir="rtl">لوحة التحكم</p>
          </div>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Mot de passe"
            className="w-full border border-border bg-background px-4 py-3 font-body text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          />
          <button type="submit" className="btn-primary w-full text-center">Connexion</button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted">
      {/* Header */}
      <header className="bg-foreground text-cream px-6 py-4 flex items-center justify-between">
        <h1 className="font-display text-xl tracking-wider">marycielo.travel — Admin</h1>
        <div className="flex items-center gap-4">
          <button
            onClick={() => {
              if (confirm('Voulez-vous réinitialiser les données aux valeurs par défaut ? Toutes les modifications locales seront perdues.')) {
                localStorage.clear();
                window.location.reload();
              }
            }}
            className="text-[10px] font-body tracking-wider uppercase bg-primary/20 hover:bg-primary/40 px-3 py-1 border border-primary/30 text-cream"
          >
            Réinitialiser
          </button>
          <button onClick={() => setAuthenticated(false)} className="text-cream/70 hover:text-cream">
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Tabs */}
      <div className="flex border-b border-border bg-background">
        {(['bookings', 'services', 'destinations'] as const).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 py-3 font-body text-xs tracking-wider uppercase text-center transition-colors ${tab === t ? 'text-primary border-b-2 border-primary' : 'text-muted-foreground'}`}
          >
            {t === 'bookings' ? 'Réservations' : t === 'services' ? 'Services' : 'Destinations'}
          </button>
        ))}
      </div>

      <div className="p-4 md:p-6 max-w-6xl mx-auto">
        {tab === 'bookings' && <BookingsTab onRefresh={forceRefresh} />}
        {tab === 'services' && <ServicesTab onRefresh={forceRefresh} />}
        {tab === 'destinations' && <DestinationsTab onRefresh={forceRefresh} />}
      </div>
    </div>
  );
};

// Bookings Tab
const BookingsTab = ({ onRefresh }: { onRefresh: () => void }) => {
  const bookings = getBookings();

  return (
    <div className="space-y-3">
      <h2 className="font-display text-2xl text-foreground mb-4">Réservations ({bookings.length})</h2>
      {bookings.length === 0 && <p className="text-muted-foreground font-body text-sm">Aucune réservation.</p>}
      {bookings.map(b => (
        <div key={b.id} className="bg-background border border-border p-4 flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="flex-1 min-w-0">
            <p className="font-body font-medium text-foreground">{b.full_name}</p>
            <p className="font-body text-sm text-muted-foreground">{b.phone}</p>
            <p className="font-body text-xs text-muted-foreground mt-1">
              {b.service} → {b.destination} • {new Date(b.created_at).toLocaleString('fr-FR')}
            </p>
          </div>
          {!b.contacted && (
            <button
              onClick={() => { markBookingContacted(b.id); onRefresh(); toast.success('Marqué comme contacté'); }}
              className="btn-primary text-xs py-2 px-4 flex items-center gap-1 self-start"
            >
              <Check className="w-3 h-3" /> Contacté
            </button>
          )}
          {b.contacted && (
            <span className="font-body text-xs text-primary tracking-wider uppercase">✓ Contacté</span>
          )}
        </div>
      ))}
    </div>
  );
};

// Services Tab
const ServicesTab = ({ onRefresh }: { onRefresh: () => void }) => {
  const services = getServices();
  const [editing, setEditing] = useState<string | null>(null);
  const [editName, setEditName] = useState('');

  const [isUploading, setIsUploading] = useState(false);

  const handleImageUpload = async (service: Service, file: File) => {
    setIsUploading(true);
    try {
      const optimized = await compressImage(file, 1200, 0.7);
      updateService({ ...service, cover_image_url: optimized });
      onRefresh();
      toast.success('Image mise à jour (optimisée)');
    } catch (error) {
      toast.error('Erreur lors de l\'optimisation de l\'image');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-3">
      <h2 className="font-display text-2xl text-foreground mb-4">Services</h2>
      {services.map(s => (
        <div key={s.id} className="bg-background border border-border p-4 flex flex-col sm:flex-row gap-4">
          <div className="w-20 h-20 bg-muted overflow-hidden flex-shrink-0 relative group">
            {s.cover_image_url && <img src={s.cover_image_url} alt={s.name_fr} className="w-full h-full object-cover" />}
            {isUploading && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <Loader2 className="w-5 h-5 text-white animate-spin" />
              </div>
            )}
            <label className="absolute inset-0 flex items-center justify-center bg-foreground/30 text-cream text-xs cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity">
              <input
                type="file"
                accept="image/*"
                className="hidden"
                disabled={isUploading}
                onChange={e => e.target.files?.[0] && handleImageUpload(s, e.target.files[0])}
              />
              Photo
            </label>
          </div>
          <div className="flex-1">
            {editing === s.id ? (
              <div className="flex gap-2">
                <input
                  value={editName}
                  onChange={e => setEditName(e.target.value)}
                  className="flex-1 border border-border px-3 py-2 font-body text-sm"
                />
                <button
                  onClick={() => { updateService({ ...s, name_fr: editName }); setEditing(null); onRefresh(); }}
                  className="text-primary"
                >
                  <Check className="w-5 h-5" />
                </button>
                <button onClick={() => setEditing(null)} className="text-muted-foreground">
                  <X className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <span className="font-body font-medium text-foreground">{s.name_fr}</span>
                <span className="font-arabic text-sm text-muted-foreground">({s.name_ar})</span>
                <button onClick={() => { setEditing(s.id); setEditName(s.name_fr); }} className="text-muted-foreground hover:text-foreground ml-auto">
                  <Edit2 className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

// Destinations Tab
const DestinationsTab = ({ onRefresh }: { onRefresh: () => void }) => {
  const destinations = getDestinations();
  const services = getServices();
  const [showForm, setShowForm] = useState(false);
  const [editingDest, setEditingDest] = useState<Destination | null>(null);
  const [form, setForm] = useState({ name_fr: '', name_ar: '', service_id: services[0]?.id || '', description_fr: '', description_ar: '' });
  const [newImages, setNewImages] = useState<string[]>([]);
  const [imageUrl, setImageUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const resetForm = () => {
    setForm({ name_fr: '', name_ar: '', service_id: services[0]?.id || '', description_fr: '', description_ar: '' });
    setNewImages([]);
    setImageUrl('');
    setEditingDest(null);
    setShowForm(false);
  };

  const handleImageFiles = async (files: FileList) => {
    setIsUploading(true);
    const fileArray = Array.from(files);
    try {
      for (const file of fileArray) {
        const optimized = await compressImage(file, 1200, 0.7);
        setNewImages(prev => [...prev, optimized]);
      }
      toast.success(`${fileArray.length} image(s) optimisée(s)`);
    } catch (error) {
      toast.error('Erreur lors du traitement des images');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingDest) {
      updateDestination({ ...editingDest, ...form, images: [...editingDest.images, ...newImages] });
      toast.success('Destination mise à jour');
    } else {
      addDestination({ ...form, images: newImages });
      toast.success('Destination ajoutée');
    }
    resetForm();
    onRefresh();
  };

  const startEdit = (d: Destination) => {
    setEditingDest(d);
    setForm({ name_fr: d.name_fr, name_ar: d.name_ar, service_id: d.service_id, description_fr: d.description_fr, description_ar: d.description_ar });
    setNewImages([]);
    setShowForm(true);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-2xl text-foreground">Destinations ({destinations.length})</h2>
        <button onClick={() => { resetForm(); setShowForm(true); }} className="btn-primary text-xs py-2 px-4 flex items-center gap-1">
          <Plus className="w-3 h-3" /> Ajouter
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-background border border-border p-4 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input value={form.name_fr} onChange={e => setForm(f => ({ ...f, name_fr: e.target.value }))} placeholder="Nom (FR)" required className="border border-border px-3 py-2 font-body text-sm" />
            <input value={form.name_ar} onChange={e => setForm(f => ({ ...f, name_ar: e.target.value }))} placeholder="الاسم (AR)" className="border border-border px-3 py-2 font-arabic text-sm" dir="rtl" />
          </div>
          <select value={form.service_id} onChange={e => setForm(f => ({ ...f, service_id: e.target.value }))} className="w-full border border-border px-3 py-2 font-body text-sm bg-background">
            {services.map(s => <option key={s.id} value={s.id}>{s.name_fr}</option>)}
          </select>
          <textarea value={form.description_fr} onChange={e => setForm(f => ({ ...f, description_fr: e.target.value }))} placeholder="Description (FR)" rows={3} className="w-full border border-border px-3 py-2 font-body text-sm" />
          <textarea value={form.description_ar} onChange={e => setForm(f => ({ ...f, description_ar: e.target.value }))} placeholder="الوصف (AR)" rows={3} className="w-full border border-border px-3 py-2 font-arabic text-sm" dir="rtl" />

          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                value={imageUrl}
                onChange={e => setImageUrl(e.target.value)}
                placeholder="Coller l'URL d'une photo d'internet"
                className="flex-1 border border-border px-3 py-2 font-body text-sm bg-background"
              />
              <button
                type="button"
                onClick={() => {
                  if (imageUrl.trim().startsWith('http')) {
                    setNewImages(prev => [...prev, imageUrl.trim()]);
                    setImageUrl('');
                  } else {
                    toast.error('L\'URL doit commencer par http');
                  }
                }}
                className="btn-outline text-xs px-4 py-2"
              >
                Ajouter l'URL
              </button>
            </div>

            <div className="flex items-center gap-3">
              <div className="h-px flex-1 bg-border" />
              <span className="text-[10px] text-muted-foreground uppercase font-body tracking-[0.2em]">ou</span>
              <div className="h-px flex-1 bg-border" />
            </div>

            <label className={cn(
              "flex items-center justify-center gap-2 border border-dashed border-border p-4 cursor-pointer hover:bg-muted transition-colors text-sm font-body text-muted-foreground",
              isUploading && "opacity-50 cursor-not-allowed"
            )}>
              {isUploading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Plus className="w-4 h-4" />
              )}
              <span>{isUploading ? 'Traitement...' : 'Télécharger depuis votre appareil'}</span>
              <input type="file" accept="image/*" multiple className="hidden" disabled={isUploading} onChange={e => e.target.files && handleImageFiles(e.target.files)} />
            </label>

            {newImages.length > 0 && (
              <div className="flex gap-2 mt-2 overflow-x-auto pb-2 scrollbar-hide">
                {newImages.map((src, i) => (
                  <div key={i} className="relative group flex-shrink-0">
                    <img src={src} alt="" className="w-20 h-20 object-cover border border-border" />
                    <button
                      type="button"
                      onClick={() => setNewImages(prev => prev.filter((_, idx) => idx !== i))}
                      className="absolute -top-1 -right-1 bg-foreground text-cream rounded-full p-1 shadow-lg hover:bg-primary transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex gap-2">
            <button type="submit" className="btn-primary text-xs py-2 px-6">{editingDest ? 'Mettre à jour' : 'Créer'}</button>
            <button type="button" onClick={resetForm} className="btn-outline text-xs py-2 px-6">Annuler</button>
          </div>
        </form>
      )}

      {destinations.map(d => {
        const svc = services.find(s => s.id === d.service_id);
        return (
          <div key={d.id} className="bg-background border border-border p-4 flex flex-col sm:flex-row gap-3">
            <div className="w-16 h-16 bg-muted overflow-hidden flex-shrink-0">
              {d.images[0] && <img src={d.images[0]} alt={d.name_fr} className="w-full h-full object-cover" />}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-body font-medium text-foreground">{d.name_fr} <span className="font-arabic text-sm text-muted-foreground">({d.name_ar})</span></p>
              <p className="font-body text-xs text-muted-foreground">{svc?.name_fr} • {d.images.length} photo(s)</p>
            </div>
            <div className="flex gap-2 self-start">
              <button onClick={() => startEdit(d)} className="text-muted-foreground hover:text-foreground"><Edit2 className="w-4 h-4" /></button>
              <button onClick={() => { deleteDestination(d.id); onRefresh(); toast.success('Supprimé'); }} className="text-destructive hover:text-destructive/80"><Trash2 className="w-4 h-4" /></button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Admin;
