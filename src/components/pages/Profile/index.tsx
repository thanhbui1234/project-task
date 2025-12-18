// components/pages/Profile/Profile.tsx
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { useState, useRef } from 'react';
import { Camera, Mail, Phone, User } from 'lucide-react';
import { toast } from 'sonner';
import { InputField } from '@/components/ui/InputField';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useGetMe } from '@/hooks/profile/useGetMe';
import { useUpdateProfile } from '@/hooks/profile/useUpdateProfile';
import { useUploadFile } from '@/hooks/useUploadFile';
import { type IProfileSchema, profileSchema } from '@/schemas/Profile';



/* ================= Component ================= */
export const Profile = () => {
  const { data: profile, isLoading } = useGetMe();
  const { mutate: updateProfile, isPending } = useUpdateProfile();
  const { mutate: uploadFile, isPending: isUploading } = useUploadFile();
  const [isEditing, setIsEditing] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const methods = useForm<IProfileSchema>({
    resolver: zodResolver(profileSchema),
    values: {
      name: profile?.name ?? '',
      phoneNumber: profile?.phoneNumber ?? '',
      password: '',
      confirmPassword: '',
    },
  });

  const { control, handleSubmit, reset, formState: { errors } } = methods;

  if (isLoading) return <div>Loading...</div>;

  const onSubmit = (values: IProfileSchema) => {
    const updateData: IProfileSchema = {
      name: values.name,
      phoneNumber: values.phoneNumber,
      ...(values.password && { password: values.password }),
    };

    updateProfile(updateData, {
      onSuccess: () => {
        setIsEditing(false);
        reset();
      },
    });
  };

  const handleCancel = () => {
    setIsEditing(false);
    reset();
  };

  const getInitials = () => {
    return profile?.name
      ?.split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase() || 'U';
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Vui lòng chọn file ảnh');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Kích thước file không được vượt quá 5MB');
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatarPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Upload file immediately
    toast.loading('Đang tải ảnh lên...', { id: 'upload-avatar' });

    uploadFile([file], {
      onSuccess: (data) => {
        toast.dismiss('upload-avatar');

        // Update profile with avatarId
        const formValues = methods.getValues();
        updateProfile(
          {
            name: formValues.name,
            phoneNumber: formValues.phoneNumber,
            avatarId: data?.[0].id
          },
          {
            onSuccess: () => {
              toast.success('Cập nhật avatar thành công');
              setAvatarPreview(null);
            },
            onError: () => {
              toast.error('Cập nhật avatar thất bại');
              setAvatarPreview(null);
            }
          }
        );
      },
      onError: (error) => {
        console.error('Avatar upload error:', error);
        toast.dismiss('upload-avatar');
        toast.error('Tải ảnh lên thất bại');
        setAvatarPreview(null);
      }
    });

    // Reset input
    event.target.value = '';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-4 md:py-8">
      <div className="max-w-3xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
        {/* Header Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl sm:rounded-2xl shadow-lg overflow-hidden mb-4 md:mb-6"
        >
          {/* Cover Background */}
          <div className="h-24 sm:h-32 md:h-40 bg-gradient-to-r from-blue-500 via-blue-600 to-indigo-600 relative overflow-hidden">
            <motion.div
              animate={{ opacity: [0.1, 0.2, 0.1] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="absolute inset-0"
              style={{
                backgroundImage:
                  "url('data:image/svg+xml,%3Csvg width=\"60\" height=\"60\" viewBox=\"0 0 60 60\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"none\" fill-rule=\"evenodd\"%3E%3Cg fill=\"%23ffffff\" fill-opacity=\"0.1\"%3E%3Cpath d=\"M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')",
              }}
            />
          </div>

          {/* Profile Info */}
          <div className="px-4 sm:px-6 md:px-8 pb-6 md:pb-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-end gap-3 sm:gap-4 md:gap-6 -mt-12 sm:-mt-16 md:-mt-20 mb-4 md:mb-6">
              {/* Avatar */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 100 }}
                className="relative flex-shrink-0"
              >
                <div className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-lg sm:rounded-xl md:rounded-2xl flex items-center justify-center shadow-xl border-4 border-white relative overflow-hidden">
                  {avatarPreview || profile?.avatar ? (
                    <>
                      <img
                        src={avatarPreview || profile?.avatar.path}
                        alt={profile?.name}
                        className="w-full h-full object-cover rounded-lg sm:rounded-xl md:rounded-2xl"
                      />
                      {isUploading && (
                        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                          <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin" />
                        </div>
                      )}
                    </>
                  ) : (
                    <span className="text-3xl sm:text-4xl md:text-5xl font-bold text-white">
                      {getInitials()}
                    </span>
                  )}
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <motion.button
                  type="button"
                  onClick={handleAvatarClick}
                  disabled={isUploading}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="absolute bottom-0 right-0 p-1.5 sm:p-2 bg-blue-500 rounded-md sm:rounded-lg shadow-lg text-white hover:bg-blue-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Camera className="w-4 h-4 sm:w-5 sm:h-5" />
                </motion.button>
              </motion.div>

              {/* User Info */}
              <div className="flex-1 pb-0 sm:pb-4">
                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-1 line-clamp-2">
                  {profile?.name}
                </h1>
                <p className="text-gray-600 text-xs sm:text-sm md:text-base mb-2 md:mb-3 flex items-center gap-1.5 break-all">
                  <Mail className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                  <span className="line-clamp-1">{profile?.email}</span>
                </p>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2 sm:px-3 py-0.5 sm:py-1 bg-blue-100 text-blue-700 rounded text-xs sm:text-sm font-semibold">
                    {profile?.role}
                  </span>
                  <span
                    className={`px-2 sm:px-3 py-0.5 sm:py-1 rounded text-xs font-semibold ${profile?.status === 'ACTIVE'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-red-100 text-red-700'
                      }`}
                  >
                    {profile?.status}
                  </span>
                </div>
              </div>

              {/* Edit Button */}
              {!isEditing && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsEditing(true)}
                  className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-2.5 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition-all shadow-md hover:shadow-lg text-sm sm:text-base"
                >
                  Chỉnh sửa
                </motion.button>
              )}
            </div>
          </div>
        </motion.div>

        {/* Edit Form */}
        {isEditing && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 md:p-8 mb-4 md:mb-6"
          >
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 md:mb-6">
              Cập nhật thông tin
            </h2>

            <FormProvider {...methods}>
              <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 md:gap-5">
                {/* Name Field */}
                <InputField
                  control={control}
                  name="name"
                  label="Tên"
                  placeholder="Nhập tên của bạn"
                  errors={errors}
                />

                {/* Email Field (Read-only) */}
                <div className="grid gap-2">
                  <Label className="flex items-center gap-2 text-sm sm:text-base">
                    <Mail className="w-4 h-4" />
                    Email
                  </Label>
                  <input
                    type="email"
                    value={profile?.email}
                    disabled
                    className="px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-300 rounded-lg bg-gray-50 text-gray-600 cursor-not-allowed text-sm sm:text-base"
                  />
                  <p className="text-gray-500 text-xs">Không thể thay đổi email</p>
                </div>

                {/* Phone Field */}
                <InputField
                  control={control}
                  name="phoneNumber"
                  label="Số điện thoại"
                  placeholder="Nhập số điện thoại"
                  errors={errors}
                />

                {/* Divider */}
                <div className="border-t border-gray-200 my-2" />

                {/* Password Field */}
                <InputField
                  control={control}
                  name="password"
                  label="Mật khẩu mới"
                  type="password"
                  placeholder="Để trống nếu không muốn thay đổi"
                  errors={errors}
                />

                {/* Confirm Password Field */}
                <InputField
                  control={control}
                  name="confirmPassword"
                  label="Xác nhận mật khẩu"
                  type="password"
                  placeholder="Xác nhận mật khẩu mới"
                  errors={errors}
                />

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-2 md:pt-4">
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1"
                  >
                    <Button
                      type="submit"
                      disabled={isPending}
                      className="w-full py-2 sm:py-2.5 bg-blue-500 hover:bg-blue-600 text-sm sm:text-base"
                    >
                      {isPending ? 'Đang lưu...' : 'Lưu thay đổi'}
                    </Button>
                  </motion.div>

                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1"
                  >
                    <Button
                      type="button"
                      onClick={handleCancel}
                      variant="outline"
                      className="w-full py-2 sm:py-2.5 text-sm sm:text-base"
                    >
                      Huỷ
                    </Button>
                  </motion.div>
                </div>
              </form>
            </FormProvider>
          </motion.div>
        )}

        {/* Info Cards */}
        {!isEditing && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4"
          >
            {/* Phone Card */}
            <motion.div
              whileHover={{ y: -5 }}
              className="bg-white rounded-lg sm:rounded-xl shadow p-4 sm:p-6 hover:shadow-lg transition"
            >
              <div className="flex items-center gap-2 sm:gap-3 mb-2 md:mb-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-100 rounded flex items-center justify-center flex-shrink-0">
                  <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                </div>
                <span className="text-gray-600 text-xs sm:text-sm font-medium">
                  Điện thoại
                </span>
              </div>
              <p className="text-gray-900 font-semibold text-sm sm:text-base break-all">
                {profile?.phoneNumber}
              </p>
            </motion.div>

            {/* Role Card */}
            <motion.div
              whileHover={{ y: -5 }}
              className="bg-white rounded-lg sm:rounded-xl shadow p-4 sm:p-6 hover:shadow-lg transition"
            >
              <div className="flex items-center gap-2 sm:gap-3 mb-2 md:mb-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-purple-100 rounded flex items-center justify-center flex-shrink-0">
                  <User className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
                </div>
                <span className="text-gray-600 text-xs sm:text-sm font-medium">Vị trí</span>
              </div>
              <p className="text-gray-900 font-semibold text-sm sm:text-base">{profile?.role}</p>
            </motion.div>

            {/* Status Card */}
            <motion.div
              whileHover={{ y: -5 }}
              className="bg-white rounded-lg sm:rounded-xl shadow p-4 sm:p-6 hover:shadow-lg transition sm:col-span-2 lg:col-span-1"
            >
              <div className="flex items-center gap-2 sm:gap-3 mb-2 md:mb-3">
                <div
                  className={`w-8 h-8 sm:w-10 sm:h-10 rounded flex items-center justify-center flex-shrink-0 ${profile?.status === 'ACTIVE'
                    ? 'bg-green-100'
                    : 'bg-red-100'
                    }`}
                >
                  <div
                    className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full ${profile?.status === 'ACTIVE'
                      ? 'bg-green-600'
                      : 'bg-red-600'
                      }`}
                  />
                </div>
                <span className="text-gray-600 text-xs sm:text-sm font-medium">Trạng thái</span>
              </div>
              <p className="text-gray-900 font-semibold text-sm sm:text-base">{profile?.status}</p>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
};