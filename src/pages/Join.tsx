import { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { membersService, foundersService } from '@/lib/firebaseService';
import { generateCertificate, downloadCertificate } from '@/lib/certificateService';
import { sendWelcomeEmailSimple } from '@/lib/emailService';
import { compressImage, isImageFile, formatBytes } from '@/lib/imageOptimization';
import { CheckCircle, Upload, User, Phone, MapPin, Calendar, Mail } from 'lucide-react';

const joinSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100, 'Name is too long'),
  email: z.string().email('Please enter a valid email address'),
  age: z.number().min(16, 'You must be at least 16 years old').max(100, 'Please enter a valid age'),
  address: z.string().min(10, 'Please enter a complete address').max(300, 'Address is too long'),
  contact: z.string().regex(/^(\+91[\-\s]?)?[0]?(91)?[6789]\d{9}$/, 'Please enter a valid Indian phone number'),
});

type JoinFormData = z.infer<typeof joinSchema>;

const JoinPage = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<JoinFormData>({
    resolver: zodResolver(joinSchema),
  });

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!isImageFile(file)) {
        toast({
          title: 'Invalid file type',
          description: 'Please upload an image file (JPG, PNG, etc.)',
          variant: 'destructive',
        });
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: 'File too large',
          description: 'Please upload an image smaller than 5MB',
          variant: 'destructive',
        });
        return;
      }

      // Show compression progress
      toast({
        title: 'Compressing image...',
        description: `Original size: ${formatBytes(file.size)}`,
      });

      // Compress the image
      const compressedFile = await compressImage(file);

      setPhotoFile(compressedFile);
      
      // Show compression result
      if (compressedFile.size < file.size) {
        toast({
          title: 'Image compressed successfully',
          description: `${formatBytes(file.size)} → ${formatBytes(compressedFile.size)}`,
        });
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(compressedFile);
    }
  };

  const onSubmit = async (data: JoinFormData) => {
    try {
      // Check for duplicate members
      const duplicateCheck = await membersService.checkDuplicate(data.email, data.name);
      
      if (duplicateCheck.isDuplicate) {
        const field = duplicateCheck.field === 'email' ? 'email address' : 'name';
        toast({
          title: 'Duplicate Member',
          description: `A member with this ${field} already exists. Please use a different ${field}.`,
          variant: 'destructive',
        });
        return;
      }
      
      const joinedDate = new Date().toISOString();
      
      // Add member to database and get the member ID
      const memberId = await membersService.add(
        {
          name: data.name,
          email: data.email,
          age: data.age,
          address: data.address,
          contact: data.contact,
          photoURL: '', // Will be set by the service if photo is provided
          joinedDate,
        },
        photoFile || undefined
      );
      
      // Generate certificate with founder name
      const certificateBlob = await generateCertificate({
        memberName: data.name,
        joinedDate,
        founderName: 'Pranay Rode',
      });
      
      // Download certificate for the user
      downloadCertificate(certificateBlob, data.name);
      
      // Send welcome email with certificate link
      try {
        await sendWelcomeEmailSimple(
          data.name,
          data.email,
          certificateBlob,
          memberId,
          joinedDate
        );
      } catch (emailError) {
        console.error('Email sending failed:', emailError);
        // Don't fail the entire process if email fails
      }
      
      toast({
        title: 'Welcome to Our Foundation!',
        description: 'Your certificate has been downloaded and a welcome email will be sent shortly.',
      });
      
      setIsSubmitted(true);
      reset();
      setPhotoPreview(null);
      setPhotoFile(null);
    } catch (error) {
      console.error('Error submitting application:', error);
      toast({
        title: 'Error',
        description: 'Failed to submit application. Please try again.',
        variant: 'destructive',
      });
    }
  };

  if (isSubmitted) {
    return (
      <Layout>
        <section className="py-20">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-lg mx-auto text-center"
            >
              <div className="w-20 h-20 rounded-full bg-accent/20 flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="h-10 w-10 text-accent" />
              </div>
              <h1 className="font-display text-3xl font-bold text-foreground mb-4">
                Welcome to Our Family!
              </h1>
              <p className="text-muted-foreground mb-8">
                Your membership application has been submitted successfully. 
                Our team will review your application and contact you within 3-5 business days.
              </p>
              <Button onClick={() => setIsSubmitted(false)}>
                Submit Another Application
              </Button>
            </motion.div>
          </div>
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Header */}
      <section className="py-16 bg-secondary/30">
        <div className="container">
          <div className="max-w-2xl">
            <h1 className="font-display text-4xl font-bold text-foreground mb-4">
              Join Our Foundation
            </h1>
            <p className="text-lg text-muted-foreground">
              Become a member of Veer Bhagat Singh Foundation and join us in our mission
              to serve the community. Fill out the form below to get started.
            </p>
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section className="py-16">
        <div className="container">
          <div className="max-w-2xl mx-auto">
            <Card className="card-shadow">
              <CardHeader>
                <CardTitle className="font-display text-2xl">Membership Form</CardTitle>
                <CardDescription>
                  All fields marked with * are required
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  {/* Photo Upload */}
                  <div className="space-y-2">
                    <Label>Profile Photo</Label>
                    <div className="flex items-center gap-4">
                      <div className="h-24 w-24 rounded-full bg-muted flex items-center justify-center overflow-hidden border-2 border-dashed border-border">
                        {photoPreview ? (
                          <img
                            src={photoPreview}
                            alt="Preview"
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <User className="h-8 w-8 text-muted-foreground" />
                        )}
                      </div>
                      <div className="flex-1">
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={handlePhotoChange}
                          className="cursor-pointer"
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          JPG, PNG up to 5MB
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Name */}
                  <div className="space-y-2">
                    <Label htmlFor="name">
                      Full Name <span className="text-destructive">*</span>
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="name"
                        placeholder="Enter your full name"
                        className="pl-10"
                        {...register('name')}
                      />
                    </div>
                    {errors.name && (
                      <p className="text-sm text-destructive">{errors.name.message}</p>
                    )}
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <Label htmlFor="email">
                      Email Address <span className="text-destructive">*</span>
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="your.email@example.com"
                        className="pl-10"
                        {...register('email')}
                      />
                    </div>
                    {errors.email && (
                      <p className="text-sm text-destructive">{errors.email.message}</p>
                    )}
                  </div>

                  {/* Age */}
                  <div className="space-y-2">
                    <Label htmlFor="age">
                      Age <span className="text-destructive">*</span>
                    </Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="age"
                        type="number"
                        placeholder="Enter your age"
                        className="pl-10"
                        {...register('age', { valueAsNumber: true })}
                      />
                    </div>
                    {errors.age && (
                      <p className="text-sm text-destructive">{errors.age.message}</p>
                    )}
                  </div>

                  {/* Contact */}
                  <div className="space-y-2">
                    <Label htmlFor="contact">
                      Contact Number <span className="text-destructive">*</span>
                    </Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="contact"
                        placeholder="+91 8007298143"
                        className="pl-10"
                        {...register('contact')}
                      />
                    </div>
                    {errors.contact && (
                      <p className="text-sm text-destructive">{errors.contact.message}</p>
                    )}
                  </div>

                  {/* Address */}
                  <div className="space-y-2">
                    <Label htmlFor="address">
                      Full Address <span className="text-destructive">*</span>
                    </Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Textarea
                        id="address"
                        placeholder="Enter your complete address"
                        className="pl-10 min-h-[100px]"
                        {...register('address')}
                      />
                    </div>
                    {errors.address && (
                      <p className="text-sm text-destructive">{errors.address.message}</p>
                    )}
                  </div>

                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <span className="animate-spin mr-2">⏳</span>
                        Submitting...
                      </>
                    ) : (
                      'Submit Application'
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default JoinPage;
