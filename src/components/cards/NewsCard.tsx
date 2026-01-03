import { useState } from 'react';
import { Calendar, User, Eye, X } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { NewsArticle } from '@/data/mockData';

interface NewsCardProps {
  article: NewsArticle;
}

export function NewsCard({ article }: NewsCardProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Card 
        className="overflow-hidden card-shadow hover:card-shadow-hover transition-all duration-300 h-full flex flex-col cursor-pointer"
        onClick={() => setIsOpen(true)}
      >
        {/* Featured Image */}
        <div className="relative aspect-video overflow-hidden">
          <img
            src={article.imageURL}
            alt={article.title}
            className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
          />
          <Badge className="absolute top-3 right-3">
            {article.category}
          </Badge>
        </div>

        <CardContent className="p-6 flex-1 flex flex-col">
          {/* Meta Information */}
          <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              <span>
                {new Date(article.publishedDate).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                })}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <User className="h-3 w-3" />
              <span>{article.author}</span>
            </div>
            {article.views !== undefined && article.views > 0 && (
              <div className="flex items-center gap-1">
                <Eye className="h-3 w-3" />
                <span>{article.views}</span>
              </div>
            )}
          </div>

          {/* Title */}
          <h3 className="font-display text-xl font-semibold text-foreground mb-3 line-clamp-2">
            {article.title}
          </h3>

          {/* Excerpt */}
          <p className="text-sm text-muted-foreground line-clamp-3 flex-1">
            {article.excerpt}
          </p>
        </CardContent>
      </Card>

      {/* Full Article Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-display pr-8">{article.title}</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            {/* Article Image */}
            <div className="relative aspect-video overflow-hidden rounded-lg bg-muted">
              <img
                src={article.imageURL}
                alt={article.title}
                className="h-full w-full object-contain"
              />
              <Badge className="absolute top-3 right-3">
                {article.category}
              </Badge>
            </div>

            {/* Article Meta */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground border-b pb-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-primary" />
                <span>
                  {new Date(article.publishedDate).toLocaleDateString('en-IN', {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-primary" />
                <span>By {article.author}</span>
              </div>
              {article.views !== undefined && article.views > 0 && (
                <div className="flex items-center gap-2">
                  <Eye className="h-4 w-4 text-primary" />
                  <span>{article.views} views</span>
                </div>
              )}
            </div>

            {/* Article Excerpt */}
            <div className="bg-secondary/30 p-4 rounded-lg border-l-4 border-primary">
              <p className="text-muted-foreground italic">
                {article.excerpt}
              </p>
            </div>

            {/* Article Content */}
            <div className="prose prose-gray dark:prose-invert max-w-none">
              <div className="text-foreground leading-relaxed whitespace-pre-line">
                {article.content}
              </div>
            </div>

            {/* Close Button */}
            <div className="flex justify-end pt-4 border-t">
              <Button variant="outline" onClick={() => setIsOpen(false)}>
                Close
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
