import { useState } from 'react';
import { trpc } from '@/lib/trpc';
import { useAuth } from '@/_core/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertCircle, Loader2, Plus, Trash2, Edit2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ImageUpload } from '@/components/ImageUpload';

interface WorkFormData {
  title: string;
  slug: string;
  year: string;
  month?: string;
  day?: string;
  medium: string;
  dimensions: string;
  seriesName: string;
  phaseId?: number;
  curatorialHook?: string;
  neonReading?: string;
  conceptTags?: string[];
  imageUrl?: string;
  imageKey?: string;
  colorPalette?: string;
  emotionalRegister?: string;
  isPublished?: boolean;
}

export default function AdminDashboard() {
  const { user, loading: authLoading } = useAuth();
  const [formData, setFormData] = useState<WorkFormData>({
    title: '',
    slug: '',
    year: new Date().getFullYear().toString(),
    medium: '',
    dimensions: '',
    seriesName: '',
    isPublished: true,
  });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [showNewSeriesInput, setShowNewSeriesInput] = useState(false);
  const [showNewPhaseInput, setShowNewPhaseInput] = useState(false);
  const [newSeriesName, setNewSeriesName] = useState('');
  const [newPhaseName, setNewPhaseName] = useState('');

  // Queries
  const utils = trpc.useUtils();
  const { data: allWorks, isLoading: worksLoading, refetch: refetchWorks } = trpc.gallery.getAll.useQuery();
  const { data: phases, isLoading: phasesLoading } = trpc.phases.list.useQuery();
  const { data: filterOptions } = trpc.gallery.getFilterOptions.useQuery();

  // Mutations
  const createWorkMutation = trpc.gallery.create.useMutation({
    onSuccess: () => {
      setMessage({ type: 'success', text: 'Work created successfully!' });
      setFormData({
        title: '',
        slug: '',
        year: new Date().getFullYear().toString(),
        medium: '',
        dimensions: '',
        seriesName: '',
        isPublished: true,
      });
      refetchWorks();
      setTimeout(() => setMessage(null), 3000);
    },
    onError: (error) => {
      setMessage({ type: 'error', text: `Error: ${error.message}` });
    },
  });

  const updateWorkMutation = trpc.gallery.update.useMutation({
    onSuccess: () => {
      setMessage({ type: 'success', text: 'Work updated successfully!' });
      setEditingId(null);
      setFormData({
        title: '',
        slug: '',
        year: new Date().getFullYear().toString(),
        medium: '',
        dimensions: '',
        seriesName: '',
        isPublished: true,
      });
      refetchWorks();
      setTimeout(() => setMessage(null), 3000);
    },
    onError: (error) => {
      setMessage({ type: 'error', text: `Error: ${error.message}` });
    },
  });

  const deleteWorkMutation = trpc.gallery.delete.useMutation({
    onSuccess: () => {
      setMessage({ type: 'success', text: 'Work deleted successfully!' });
      refetchWorks();
      setTimeout(() => setMessage(null), 3000);
    },
    onError: (error) => {
      setMessage({ type: 'error', text: `Error: ${error.message}` });
    },
  });

  const createPhaseMutation = trpc.phases.create.useMutation({
    onSuccess: () => {
      setMessage({ type: 'success', text: 'Phase created successfully!' });
      setShowNewPhaseInput(false);
      setNewPhaseName('');
      // Invalidate phase queries to refetch the updated list
      utils.phases.list.invalidate();
      setTimeout(() => setMessage(null), 3000);
    },
    onError: (error) => {
      setMessage({ type: 'error', text: `Error creating phase: ${error.message}` });
    },
  });

  // Check admin access
  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (!user || user.role !== 'admin') {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            You do not have permission to access this page. Admin access required.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Generate slug from title if not provided
    const slug = formData.slug || formData.title.toLowerCase().replace(/\s+/g, '-');

    const payload = {
      ...formData,
      slug,
      phaseId: formData.phaseId ? parseInt(formData.phaseId.toString()) : undefined,
    };

    if (editingId) {
      updateWorkMutation.mutate({ id: editingId, ...payload });
    } else {
      createWorkMutation.mutate(payload);
    }
  };

  const handleEdit = (work: any) => {
    setEditingId(work.id);
    setFormData({
      title: work.title,
      slug: work.slug,
      year: work.year,
      medium: work.medium,
      dimensions: work.dimensions,
      seriesName: work.seriesName,
      phaseId: work.phaseId,
      curatorialHook: work.curatorialHook,
      neonReading: work.neonReading,
      conceptTags: work.conceptTags,
      imageUrl: work.imageUrl,
      imageKey: work.imageKey,
      colorPalette: work.colorPalette,
      emotionalRegister: work.emotionalRegister,
      isPublished: work.isPublished,
    });
  };

  const handleCancel = () => {
    setEditingId(null);
    setFormData({
      title: '',
      slug: '',
      year: new Date().getFullYear().toString(),
      medium: '',
      dimensions: '',
      seriesName: '',
      isPublished: true,
    });
  };

  const filteredWorks = allWorks?.items?.filter((work: any) =>
    work.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    work.seriesName.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-muted-foreground">Manage gallery works and metadata</p>
      </div>

      {message && (
        <Alert variant={message.type === 'success' ? 'default' : 'destructive'} className="mb-6">
          <AlertDescription>{message.text}</AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="form" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="form">
            <Plus className="w-4 h-4 mr-2" />
            {editingId ? 'Edit Work' : 'Add Work'}
          </TabsTrigger>
          <TabsTrigger value="list">
            Manage Works ({allWorks?.items?.length || 0})
          </TabsTrigger>
        </TabsList>

        {/* Form Tab */}
        <TabsContent value="form" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{editingId ? 'Edit Work' : 'Add New Work'}</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Title and Slug */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Title *</label>
                    <Input
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="Work title"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Slug</label>
                    <Input
                      value={formData.slug}
                      onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                      placeholder="Auto-generated from title"
                    />
                  </div>
                </div>

                {/* Date: Year, Month, Day */}
                <div className="space-y-4">
                  <label className="block text-sm font-medium">Date *</label>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Input
                        value={formData.year}
                        onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                        placeholder="Year (2024)"
                        required
                      />
                    </div>
                    <div>
                      <Input
                        value={formData.month || ''}
                        onChange={(e) => setFormData({ ...formData, month: e.target.value })}
                        placeholder="Month (01-12)"
                        maxLength={2}
                      />
                    </div>
                    <div>
                      <Input
                        value={formData.day || ''}
                        onChange={(e) => setFormData({ ...formData, day: e.target.value })}
                        placeholder="Day (01-31)"
                        maxLength={2}
                      />
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">Month and day are optional</p>
                </div>

                {/* Medium, Dimensions */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Medium *</label>
                    <Input
                      value={formData.medium}
                      onChange={(e) => setFormData({ ...formData, medium: e.target.value })}
                      placeholder="e.g., Ink on Paper"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Dimensions *</label>
                    <Input
                      value={formData.dimensions}
                      onChange={(e) => setFormData({ ...formData, dimensions: e.target.value })}
                      placeholder="e.g., 40cm × 40cm"
                      required
                    />
                  </div>
                </div>

                {/* Series and Phase */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Series *</label>
                    {showNewSeriesInput ? (
                      <div className="space-y-2">
                        <Input
                          value={newSeriesName}
                          onChange={(e) => {
                            setNewSeriesName(e.target.value);
                            setFormData({ ...formData, seriesName: e.target.value });
                          }}
                          placeholder="Enter new series name"
                          autoFocus
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setShowNewSeriesInput(false);
                            setNewSeriesName('');
                            setFormData({ ...formData, seriesName: '' });
                          }}
                        >
                          Cancel
                        </Button>
                      </div>
                    ) : (
                      <Select
                        value={formData.seriesName}
                        onValueChange={(value) => {
                          if (value === '__new__') {
                            setShowNewSeriesInput(true);
                          } else {
                            setFormData({ ...formData, seriesName: value });
                          }
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select series" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="__new__">
                            <span className="flex items-center gap-2">
                              <Plus className="w-4 h-4" />
                              Create New Series
                            </span>
                          </SelectItem>
                          {filterOptions?.series?.map((series: string) => (
                            <SelectItem key={series} value={series}>
                              {series}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Phase</label>
                    {showNewPhaseInput ? (
                      <div className="space-y-2">
                        <Input
                          value={newPhaseName}
                          onChange={(e) => setNewPhaseName(e.target.value)}
                          placeholder="Enter new phase name"
                          autoFocus
                        />
                        <div className="flex gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              if (newPhaseName.trim()) {
                                // Generate a code from the title (e.g., "New Phase" -> "NEW_PHASE")
                                const code = newPhaseName.toUpperCase().replace(/\s+/g, '_').substring(0, 16);
                                const currentYear = new Date().getFullYear().toString();
                                
                                createPhaseMutation.mutate({
                                  code,
                                  title: newPhaseName.trim(),
                                  year: currentYear,
                                  sortOrder: 999, // Place new phases at the end
                                });
                              }
                            }}
                            disabled={createPhaseMutation.isPending}
                          >
                            {createPhaseMutation.isPending ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              'Create'
                            )}
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setShowNewPhaseInput(false);
                              setNewPhaseName('');
                            }}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <Select
                        value={formData.phaseId?.toString() || ''}
                        onValueChange={(value) => {
                          if (value === '__new__') {
                            setShowNewPhaseInput(true);
                          } else {
                            setFormData({ ...formData, phaseId: parseInt(value) });
                          }
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select phase" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="__new__">
                            <span className="flex items-center gap-2">
                              <Plus className="w-4 h-4" />
                              Create New Phase
                            </span>
                          </SelectItem>
                          {phases?.map((phase: any) => (
                            <SelectItem key={phase.id} value={phase.id.toString()}>
                              {phase.title}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  </div>
                </div>

                {/* Curatorial Hook */}
                <div>
                  <label className="block text-sm font-medium mb-2">Curatorial Hook</label>
                  <Textarea
                    value={formData.curatorialHook || ''}
                    onChange={(e) => setFormData({ ...formData, curatorialHook: e.target.value })}
                    placeholder="Brief curatorial note about this work"
                    rows={3}
                  />
                </div>

                {/* Neon Reading */}
                <div>
                  <label className="block text-sm font-medium mb-2">Neon Reading</label>
                  <Textarea
                    value={formData.neonReading || ''}
                    onChange={(e) => setFormData({ ...formData, neonReading: e.target.value })}
                    placeholder="Detailed analysis and reading of the work"
                    rows={4}
                  />
                </div>

                {/* Image Upload */}
                <ImageUpload
                  currentImageUrl={formData.imageUrl}
                  onUploadComplete={(url) => setFormData({ ...formData, imageUrl: url })}
                />

                {/* Color Palette and Emotional Register */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Color Palette</label>
                    <Input
                      value={formData.colorPalette || ''}
                      onChange={(e) => setFormData({ ...formData, colorPalette: e.target.value })}
                      placeholder="e.g., Ink, Gold, Cream"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Emotional Register</label>
                    <Input
                      value={formData.emotionalRegister || ''}
                      onChange={(e) =>
                        setFormData({ ...formData, emotionalRegister: e.target.value })
                      }
                      placeholder="e.g., Meditative, Urgent"
                    />
                  </div>
                </div>

                {/* Publish Status */}
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="isPublished"
                    checked={formData.isPublished || false}
                    onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                    className="w-4 h-4"
                  />
                  <label htmlFor="isPublished" className="text-sm font-medium">
                    Publish this work
                  </label>
                </div>

                {/* Submit Buttons */}
                <div className="flex gap-4 pt-4">
                  <Button
                    type="submit"
                    disabled={
                      createWorkMutation.isPending ||
                      updateWorkMutation.isPending ||
                      !formData.title ||
                      !formData.medium ||
                      !formData.dimensions ||
                      !formData.seriesName
                    }
                  >
                    {createWorkMutation.isPending || updateWorkMutation.isPending ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        {editingId ? 'Updating...' : 'Creating...'}
                      </>
                    ) : editingId ? (
                      'Update Work'
                    ) : (
                      'Create Work'
                    )}
                  </Button>
                  {editingId && (
                    <Button type="button" variant="outline" onClick={handleCancel}>
                      Cancel
                    </Button>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* List Tab */}
        <TabsContent value="list" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Gallery Works</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Search */}
              <div>
                <Input
                  placeholder="Search works by title or series..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="mb-4"
                />
              </div>

              {/* Works List */}
              {worksLoading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="w-8 h-8 animate-spin" />
                </div>
              ) : filteredWorks.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">No works found</p>
              ) : (
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {filteredWorks.map((work: any) => (
                    <div
                      key={work.id}
                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium truncate">{work.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {work.seriesName} • {work.year} • {work.medium}
                        </p>
                      </div>
                      <div className="flex gap-2 ml-4">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(work)}
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => deleteWorkMutation.mutate({ id: work.id })}
                          disabled={deleteWorkMutation.isPending}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
