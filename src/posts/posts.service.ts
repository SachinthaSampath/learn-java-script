import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/createPost.dto';
// import { Post } from './post.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdatePostDto } from './dto/updatePost.dto';
import Post from './entities/post.entity';

@Injectable()
export default class PostsService {
	constructor(@InjectRepository(Post) private postRepository: Repository<Post>) {}

	private lastPostId = 0;
	private posts: Post[] = [];

	getAllPosts() {
		return this.postRepository.find();
	}

	async getPostById(id: number) {
		const post = await this.postRepository.findOne({ where: { id } });
		if (post) {
			return post;
		}
		throw new HttpException('Post not found', HttpStatus.NOT_FOUND);
	}

	async updatePost(id: number, post: UpdatePostDto) {
		await this.postRepository.update(id, post);
		const updatedPost = await this.postRepository.findOne({ where: { id } });
		if (updatedPost) {
			return updatedPost;
		}
		throw new HttpException('Post not found', HttpStatus.NOT_FOUND);
	}

	async createPost(post: CreatePostDto) {
		const newPost = await this.postRepository.create(post);
		await this.postRepository.save(newPost);
		return newPost;
	}

	async deletePost(id: number) {
		const deleteResponse = await this.postRepository.delete(id);
		if (!deleteResponse.affected) throw new HttpException('Post not found', HttpStatus.NOT_FOUND);
	}
}
