import { toast } from 'sonner';

const Toaster = ({
  type,
  message,
  description = '',
}: {
  type: 'success' | 'error';
  message: string;
  description?: string;
}) => {
  return toast[type](message, {
    description: description,
  });
};

export default Toaster;
