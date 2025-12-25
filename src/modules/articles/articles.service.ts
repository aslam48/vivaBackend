import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Article, ArticleDocument } from './schemas/article.schema';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';

@Injectable()
export class ArticlesService {
  constructor(
    @InjectModel(Article.name) private articleModel: Model<ArticleDocument>,
  ) {}

  async create(createArticleDto: CreateArticleDto): Promise<Article> {
    const createdArticle = new this.articleModel({
      ...createArticleDto,
      publishedAt: createArticleDto.publishedAt || new Date(),
    });
    return createdArticle.save();
  }

  async findAll(): Promise<Article[]> {
    return this.articleModel.find().sort({ publishedAt: -1 }).exec();
  }

  async findOne(id: string): Promise<Article> {
    const article = await this.articleModel.findById(id).exec();
    if (!article) {
      throw new NotFoundException(`Article with ID ${id} not found`);
    }
    return article;
  }

  async getRecommendedArticles(
    userId?: string,
    limit: number = 3,
  ): Promise<Article[]> {
    // For now, return most recent articles
    // In a production app, this could be personalized based on user's cycle phase, symptoms, etc.
    return this.articleModel
      .find()
      .sort({ publishedAt: -1 })
      .limit(limit)
      .exec();
  }

  async update(id: string, updateArticleDto: UpdateArticleDto): Promise<Article> {
    const updatedArticle = await this.articleModel
      .findByIdAndUpdate(id, updateArticleDto, { new: true })
      .exec();
    if (!updatedArticle) {
      throw new NotFoundException(`Article with ID ${id} not found`);
    }
    return updatedArticle;
  }

  async remove(id: string): Promise<void> {
    const result = await this.articleModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Article with ID ${id} not found`);
    }
  }
}

