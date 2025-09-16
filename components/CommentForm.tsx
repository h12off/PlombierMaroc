
import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

interface CommentFormProps {
  onCommentSubmit: (author: string, content: string) => Promise<void>;
}

const CommentForm: React.FC<CommentFormProps> = ({ onCommentSubmit }) => {
  const { t } = useLanguage();
  const [author, setAuthor] = useState('');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ author?: string; content?: string }>({});

  const validate = () => {
    const newErrors: { author?: string; content?: string } = {};
    if (!author.trim()) newErrors.author = t('commentForm.validation.nameRequired');
    if (!content.trim()) newErrors.content = t('commentForm.validation.commentRequired');
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
        await onCommentSubmit(author, content);
        setAuthor('');
        setContent('');
        setErrors({});
    } catch (error) {
        // Error is handled by the parent, which will show a toast.
        // The form just needs to know to stop the loading spinner.
    } finally {
        setIsSubmitting(false);
    }
  };

  return (
    <div className="mt-8 bg-gray-50 p-6 rounded-lg">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">{t('plumberDetail.commentFormTitle')}</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="author" className="sr-only">{t('commentForm.namePlaceholder')}</label>
          <input
            id="author"
            type="text"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            placeholder={t('commentForm.namePlaceholder')}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-600 transition ${errors.author ? 'border-red-500' : 'border-gray-300'}`}
          />
          {errors.author && <p className="text-red-600 text-sm mt-1">{errors.author}</p>}
        </div>
        <div>
          <label htmlFor="content" className="sr-only">{t('commentForm.commentPlaceholder')}</label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={t('commentForm.commentPlaceholder')}
            rows={4}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-600 transition ${errors.content ? 'border-red-500' : 'border-gray-300'}`}
          ></textarea>
          {errors.content && <p className="text-red-600 text-sm mt-1">{errors.content}</p>}
        </div>
        <div className="text-right">
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-red-700 text-white font-bold py-2 px-6 rounded-lg hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-600 transition-transform transform hover:scale-105 disabled:bg-red-400 disabled:cursor-not-allowed"
          >
            {isSubmitting ? t('commentForm.submitting') : t('commentForm.submitButton')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CommentForm;
