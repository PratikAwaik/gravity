import { Comment } from "@prisma/client";
import { Context } from "apollo-server-core";
import { IApolloContext } from "./context";
import { Direction } from "./enums";

export interface IGetCommentsArgs {
  postId: string;
  parentId: string | null;
}

export interface IGetAllUserCommentsArgs {
  pageNo: number;
  userId?: string;
  search?: string;
}

export interface ICreateCommentArgs {
  content: string;
  postId: string;
  parentId?: string;
}

export interface IUpdateCommentArgs {
  commentId: string;
  content: string;
}

export interface IDeleteCommentArgs {
  postId: string;
  commentId: string;
}

export interface IUpdateCommentScoreArgs {
  commentId: string;
  direction: Direction;
}

export interface ICommentsController {
  getComments(
    _: unknown,
    args: IGetCommentsArgs,
    context: Context<IApolloContext>
  ): Promise<Comment[]>;
  getAllComments(
    _: unknown,
    args: IGetAllUserCommentsArgs,
    context: Context<IApolloContext>
  ): Promise<Comment[] | null>;
  createComment(
    _: unknown,
    args: ICreateCommentArgs,
    context: Context<IApolloContext>
  ): Promise<Comment | Error>;
  updateCommentScore(
    _: unknown,
    args: IUpdateCommentScoreArgs,
    context: Context<IApolloContext>
  ): Promise<Comment | Error>;
}
