import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';
import { X, Upload } from 'lucide-react';
import { z } from 'zod';

const propertySchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  description: z.string().min(20, 'Description must be at least 20 characters'),
  price: z.number().positive('Price must be positive'),
  bedrooms: z.number().positive('Bedrooms must be at least 1'),
  bathrooms: z.number().positive('Bathrooms must be at least 1'),
});

export default function EditProperty() {
  const { id } = useParams();
  const { user, userRole } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [fetchingProperty, setFetchingProperty] = useState(true);
  const [existingImages, setExistingImages] = useState<any[]>([]);
  const [newImages, setNewImages] = useState<File[]>([]);
  const [newImagePreviews, setNewImagePreviews] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    property_type: 'rent',
    price: '',
    location: '',
    bedrooms: '',
    bathrooms: '',
    area_sqft: '',
    available_from: '',
    available_to: '',
  });

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    if (userRole !== 'seller') {
      navigate('/buyer-dashboard');
      return;
    }
    if (id) {
      fetchProperty();
    }
  }, [user, userRole, id]);

  const fetchProperty = async () => {
    try {
      setFetchingProperty(true);
      const { data: property, error } = await supabase
        .from('properties')
        .select('*, property_images(*)')
        .eq('id', id)
        .eq('seller_id', user?.id)
        .single();

      if (error) throw error;

      if (!property) {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Property not found or you do not have permission to edit it.',
        });
        navigate('/seller-dashboard');
        return;
      }

      setFormData({
        title: property.title,
        description: property.description,
        property_type: property.property_type,
        price: property.price.toString(),
        location: property.location,
        bedrooms: property.bedrooms.toString(),
        bathrooms: property.bathrooms.toString(),
        area_sqft: property.area_sqft?.toString() || '',
        available_from: property.available_from || '',
        available_to: property.available_to || '',
      });

      setExistingImages(property.property_images || []);
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to load property details.',
      });
      navigate('/seller-dashboard');
    } finally {
      setFetchingProperty(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const totalImages = existingImages.length + newImages.length + files.length;
    
    if (totalImages > 5) {
      toast({
        variant: 'destructive',
        title: 'Too many images',
        description: 'You can have maximum 5 images per property.',
      });
      return;
    }

    setNewImages((prev) => [...prev, ...files]);
    
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewImagePreviews((prev) => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeNewImage = (index: number) => {
    setNewImages((prev) => prev.filter((_, i) => i !== index));
    setNewImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const removeExistingImage = async (imageId: string, imageUrl: string) => {
    try {
      // Extract file path from URL
      const urlParts = imageUrl.split('/property-images/');
      if (urlParts.length > 1) {
        const filePath = urlParts[1];
        await supabase.storage.from('property-images').remove([filePath]);
      }

      // Delete from database
      const { error } = await supabase
        .from('property_images')
        .delete()
        .eq('id', imageId);

      if (error) throw error;

      setExistingImages((prev) => prev.filter((img) => img.id !== imageId));

      toast({
        title: 'Success',
        description: 'Image removed successfully.',
      });
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to remove image.',
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const validatedData = propertySchema.parse({
        title: formData.title,
        description: formData.description,
        price: parseFloat(formData.price),
        bedrooms: parseInt(formData.bedrooms),
        bathrooms: parseInt(formData.bathrooms),
      });

      const updateData: any = {
        ...validatedData,
        property_type: formData.property_type,
        location: formData.location,
        area_sqft: formData.area_sqft ? parseInt(formData.area_sqft) : null,
        available_from: formData.available_from || null,
        available_to: formData.available_to || null,
      };

      const { error } = await supabase
        .from('properties')
        .update(updateData)
        .eq('id', id);

      if (error) throw error;

      // Upload new images if any
      if (newImages.length > 0) {
        const maxOrder = existingImages.length > 0 
          ? Math.max(...existingImages.map(img => img.display_order))
          : -1;

        const uploadPromises = newImages.map(async (image, index) => {
          const fileExt = image.name.split('.').pop();
          const fileName = `${id}/${Math.random()}.${fileExt}`;
          
          const { error: uploadError } = await supabase.storage
            .from('property-images')
            .upload(fileName, image);

          if (uploadError) throw uploadError;

          const { data: { publicUrl } } = supabase.storage
            .from('property-images')
            .getPublicUrl(fileName);

          const { error: insertError } = await supabase
            .from('property_images')
            .insert({
              property_id: id,
              image_url: publicUrl,
              display_order: maxOrder + index + 1,
            });

          if (insertError) throw insertError;
        });

        await Promise.all(uploadPromises);
      }

      toast({
        title: 'Success',
        description: 'Property updated successfully!',
      });

      navigate('/seller-dashboard');
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        toast({
          variant: 'destructive',
          title: 'Validation Error',
          description: error.errors[0].message,
        });
      } else {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Failed to update property. Please try again.',
        });
      }
    } finally {
      setLoading(false);
    }
  };

  if (fetchingProperty) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container py-12 text-center">
          <p className="text-muted-foreground">Loading property details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container py-8 max-w-3xl">
        <Card>
          <CardHeader>
            <CardTitle>Edit Property</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="title">Property Title *</Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Modern 2BR Apartment in Downtown"
                  required
                />
              </div>

              <div>
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe your property..."
                  rows={5}
                  required
                />
              </div>

              <div>
                <Label>Property Type *</Label>
                <RadioGroup
                  value={formData.property_type}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, property_type: value }))}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="rent" id="rent" />
                    <Label htmlFor="rent" className="font-normal cursor-pointer">
                      For Rent
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="sale" id="sale" />
                    <Label htmlFor="sale" className="font-normal cursor-pointer">
                      For Sale
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="price">
                    Price * {formData.property_type === 'rent' ? '(per month)' : ''}
                  </Label>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="2000"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="location">Location *</Label>
                  <Input
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="City, State"
                    required
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="bedrooms">Bedrooms *</Label>
                  <Input
                    id="bedrooms"
                    name="bedrooms"
                    type="number"
                    value={formData.bedrooms}
                    onChange={handleChange}
                    min="1"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="bathrooms">Bathrooms *</Label>
                  <Input
                    id="bathrooms"
                    name="bathrooms"
                    type="number"
                    value={formData.bathrooms}
                    onChange={handleChange}
                    min="1"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="area_sqft">Area (sqft)</Label>
                  <Input
                    id="area_sqft"
                    name="area_sqft"
                    type="number"
                    value={formData.area_sqft}
                    onChange={handleChange}
                    placeholder="1200"
                  />
                </div>
              </div>

              {formData.property_type === 'rent' && (
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="available_from">Available From</Label>
                    <Input
                      id="available_from"
                      name="available_from"
                      type="date"
                      value={formData.available_from}
                      onChange={handleChange}
                    />
                  </div>

                  <div>
                    <Label htmlFor="available_to">Available To</Label>
                    <Input
                      id="available_to"
                      name="available_to"
                      type="date"
                      value={formData.available_to}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              )}

              <div>
                <Label>Current Images</Label>
                {existingImages.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-2">
                    {existingImages.map((image) => (
                      <div key={image.id} className="relative group">
                        <img
                          src={image.image_url}
                          alt="Property"
                          className="w-full h-32 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => removeExistingImage(image.id, image.image_url)}
                          className="absolute top-2 right-2 bg-destructive text-destructive-foreground p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground mt-2">No images uploaded yet</p>
                )}
              </div>

              <div>
                <Label htmlFor="images">Add New Images (Max {5 - existingImages.length} more)</Label>
                <div className="mt-2">
                  <Input
                    id="images"
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageChange}
                    disabled={existingImages.length >= 5}
                    className="cursor-pointer"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Total limit: 5 images per property
                  </p>
                </div>
                
                {newImagePreviews.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                    {newImagePreviews.map((preview, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={preview}
                          alt={`New Preview ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => removeNewImage(index)}
                          className="absolute top-2 right-2 bg-destructive text-destructive-foreground p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex gap-4">
                <Button type="submit" className="flex-1" disabled={loading}>
                  {loading ? 'Updating...' : 'Update Property'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/seller-dashboard')}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
