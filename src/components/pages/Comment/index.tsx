import { useState, useRef } from 'react';
import { useGetMe } from '@/hooks/profile/useGetMe';
import { useCreateComment } from '@/hooks/task/comment/useCreateComment';
import { useUploadFile } from '@/hooks/useUploadFile';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Image as ImageIcon,
  Send,
  Smile,
  X,
  MessageSquare,
  Paperclip,
  MoreHorizontal,
  Download
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { toast } from 'sonner';

interface IComment {
  id: string;
  content: string;
  user: {
    id: string;
    name: string;
    role: string;
    avatar?: {
      path: string;
    };
  };
  files: Array<{
    id: string;
    path: string;
    name: string;
    type: string;
  }>;
  createdAt: number;
}

interface CommentComponentProps {
  taskId: string;
  commentsData: any; // Using any as the structure might vary, we'll normalize it
}

export const CommentComponent = ({ taskId, commentsData }: CommentComponentProps) => {
  const [content, setContent] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploadingFiles, setUploadingFiles] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: me } = useGetMe();
  const { createComment, isPending: isCreating } = useCreateComment(taskId);
  const { mutateAsync: uploadFiles } = useUploadFile();

  // Normalize comments data - hook now returns response.data directly
  const comments: IComment[] = Array.isArray(commentsData) ? commentsData : [];

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setSelectedFiles(prev => [...prev, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSend = async () => {
    if (isCreating || uploadingFiles) return;
    if (!content.trim() && selectedFiles.length === 0) return;

    try {
      let fileIds: string[] = [];

      if (selectedFiles.length > 0) {
        setUploadingFiles(true);
        const uploaded = await uploadFiles(selectedFiles);
        fileIds = uploaded.map(f => f.id);
      }

      createComment({
        content: content.trim(),
        fileIds
      }, {
        onSuccess: () => {
          setContent('');
          setSelectedFiles([]);
          setUploadingFiles(false);
          toast.success('Gửi bình luận thành công');
        },
        onError: () => {
          setUploadingFiles(false);
        }
      });
    } catch (error) {
      console.error('Failed to send comment:', error);
      setUploadingFiles(false);
      toast.error('Không thể gửi bình luận');
    }
  };

  const getInitials = (name: string) => {
    return name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || '?';
  };

  return (
    <div className="mt-8 space-y-6">
      {/* HEADER */}
      <div className="flex items-center gap-2 px-2">
        <MessageSquare className="h-5 w-5 text-slate-500" />
        <h3 className="font-bold text-slate-900 dark:text-slate-100">
          Bình luận ({comments.length})
        </h3>
      </div>

      <Card className="border-0 shadow-xl shadow-slate-200/50 dark:shadow-slate-900/50 overflow-visible">
        <CardContent className="p-6">
          {/* INPUT AREA */}
          <div className="flex gap-4 items-start">
            <Avatar className="h-8 w-8 sm:h-10 sm:w-10 border-2 border-white shadow-sm shrink-0">
              <AvatarImage src={me?.avatar?.path} alt={me?.name} />
              <AvatarFallback className="bg-linear-to-br from-indigo-500 to-purple-600 text-white font-bold text-xs sm:text-sm">
                {getInitials(me?.name || '')}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 space-y-3">
              <div className="relative group">
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Viết bình luận..."
                  className="w-full min-h-[80px] sm:min-h-[44px] max-h-[200px] py-2.5 px-4 pr-12 sm:pr-24 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all resize-none text-sm"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
                  <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-slate-100">
                    <Smile className="h-5 w-5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-slate-100"
                    onClick={handleSend}
                    disabled={isCreating || uploadingFiles || (!content.trim() && selectedFiles.length === 0)}
                  >
                    {isCreating || uploadingFiles ? (
                      <div className="h-4 w-4 border-2 border-indigo-500 border-t-transparent animate-spin rounded-full" />
                    ) : (
                      <Send className="h-5 w-5" />
                    )}
                  </Button>
                </div>
              </div>

              {/* ACTION BAR */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    className="hidden"
                    ref={fileInputRef}
                    onChange={handleFileSelect}
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => fileInputRef.current?.click()}
                    className="h-9 w-9 rounded-xl text-slate-400 hover:text-indigo-600 hover:bg-slate-100 border border-transparent hover:border-indigo-100"
                  >
                    <ImageIcon className="h-5 w-5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 rounded-xl text-slate-400 hover:text-indigo-600 hover:bg-slate-100 border border-transparent hover:border-indigo-100"
                  >
                    <Paperclip className="h-5 w-5" />
                  </Button>
                </div>

                {selectedFiles.length > 0 && (
                  <span className="text-xs font-medium text-slate-400">
                    {selectedFiles.length} tệp đã chọn
                  </span>
                )}
              </div>

              {/* FILE PREVIEWS */}
              <AnimatePresence>
                {selectedFiles.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="flex flex-wrap gap-2 pt-2"
                  >
                    {selectedFiles.map((file, idx) => (
                      <div key={idx} className="relative h-16 w-16 rounded-lg overflow-hidden border border-slate-200 group">
                        <img
                          src={URL.createObjectURL(file)}
                          alt="preview"
                          className="h-full w-full object-cover"
                        />
                        <button
                          onClick={() => removeFile(idx)}
                          className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <Separator className="my-8 opacity-50" />

          {/* COMMENTS LIST */}
          <div className="space-y-8">
            {comments.length === 0 ? (
              <div className="py-12 flex flex-col items-center justify-center text-center space-y-3">
                <div className="h-16 w-16 rounded-full bg-slate-50 flex items-center justify-center">
                  <MessageSquare className="h-8 w-8 text-slate-200" />
                </div>
                <p className="text-sm font-medium text-slate-400">
                  Chưa có bình luận nào. Hãy là người đầu tiên bình luận!
                </p>
              </div>
            ) : (
              comments.map((comment) => (
                <motion.div
                  key={comment.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex gap-4 group"
                >
                  <Avatar className="h-8 w-8 sm:h-9 sm:w-9 border shadow-sm shrink-0">
                    <AvatarImage src={comment.user?.avatar?.path} alt={comment.user?.name} />
                    <AvatarFallback className="bg-slate-100 text-slate-600 font-bold text-[10px] sm:text-xs">
                      {getInitials(comment.user?.name || '')}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-slate-900 dark:text-slate-100">
                          {comment.user?.name}
                        </span>
                        {comment.user?.role && (
                          <span className="px-1.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                            {comment.user.role}
                          </span>
                        )}
                        <span className="text-slate-300 dark:text-slate-700">•</span>
                        <span className="text-[11px] text-slate-400 font-medium">
                          {format(comment.createdAt, 'HH:mm, dd MMM yyyy', { locale: vi })}
                        </span>
                      </div>
                      <Button variant="ghost" size="icon" className="h-7 w-7 opacity-0 group-hover:opacity-100 rounded-lg">
                        <MoreHorizontal className="h-4 w-4 text-slate-400" />
                      </Button>
                    </div>

                    <div className="bg-slate-50 dark:bg-slate-900/50 rounded-2xl rounded-tl-none p-4 border border-slate-100 dark:border-slate-800">
                      <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
                        {comment.content}
                      </p>

                      {/* Comment Attachments */}
                      {comment.files && comment.files.length > 0 && (
                        <div className="mt-4 flex flex-wrap gap-2">
                          {comment.files.map((file) => (
                            <div
                              key={file.id}
                              className="group/file relative w-full sm:max-w-[200px] rounded-xl overflow-hidden border border-slate-200 shadow-sm"
                            >
                              <img
                                src={file.path}
                                alt={file.name}
                                className="w-full sm:max-h-48 object-cover transition-transform group-hover/file:scale-105"
                              />
                              <div className="absolute inset-0 bg-black/0 group-hover/file:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover/file:opacity-100">
                                <Button size="icon" variant="secondary" className="h-8 w-8 rounded-full shadow-lg">
                                  <Download className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const Separator = ({ className }: { className?: string }) => (
  <div className={`h-px w-full bg-slate-200 dark:bg-slate-800 ${className}`} />
);