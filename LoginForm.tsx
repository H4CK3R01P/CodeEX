import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Code2, GraduationCap } from 'lucide-react';

interface LoginFormProps {
  onSubmit: (name: string, contact: string) => void;
}

export function LoginForm({ onSubmit }: LoginFormProps) {
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [errors, setErrors] = useState({ name: '', contact: '' });

  const validateForm = () => {
    const newErrors = { name: '', contact: '' };
    let isValid = true;

    if (!name.trim()) {
      newErrors.name = 'Name is required';
      isValid = false;
    }

    if (!contact.trim()) {
      newErrors.contact = 'Email or Mobile number is required';
      isValid = false;
    } else {
      // Basic validation for email or phone
      const isEmail = contact.includes('@');
      const isPhone = /^\d{10,}$/.test(contact.replace(/[\s\-\(\)]/g, ''));
      
      if (!isEmail && !isPhone) {
        newErrors.contact = 'Please enter a valid email or mobile number';
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(name, contact);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-3 rounded-xl">
              <Code2 className="w-8 h-8 text-white" />
            </div>
            <GraduationCap className="w-10 h-10 text-indigo-600" />
          </div>
          <h1 className="text-indigo-900 mb-2">EduMaster Pro</h1>
          <p className="text-gray-600">Your Gateway to Excellence</p>
        </div>

        <Card className="shadow-xl border-0">
          <CardHeader className="space-y-1">
            <CardTitle>Welcome!</CardTitle>
            <CardDescription>
              Create your account to access coding challenges and competitive exam preparation
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={errors.name ? 'border-red-500' : ''}
                />
                {errors.name && (
                  <p className="text-red-500 text-sm">{errors.name}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="contact">Email or Mobile Number</Label>
                <Input
                  id="contact"
                  placeholder="email@example.com or mobile number"
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  className={errors.contact ? 'border-red-500' : ''}
                />
                {errors.contact && (
                  <p className="text-red-500 text-sm">{errors.contact}</p>
                )}
              </div>

              <Button type="submit" className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700">
                Continue
              </Button>
            </form>

            <div className="mt-6 pt-6 border-t">
              <p className="text-sm text-gray-500 text-center">
                By continuing, you agree to our Terms of Service and Privacy Policy
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
