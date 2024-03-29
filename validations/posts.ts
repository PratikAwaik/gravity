import { UserInputError } from "apollo-server";
import { PostType } from "../models/server/enums";
import {
  ICreatePostArgs,
  IDeletePostArgs,
  IUpdatePostArgs,
  IUpdatePostScoreArgs,
} from "../models/server/posts";
import { throwError } from "../utils/server/errors";

export const validateCreatePostDetails = (args: ICreatePostArgs) => {
  if (args?.title?.length < 3) {
    throwError(UserInputError, "Post Title should be more than 3 characters");
  } else if (args.type === PostType.ARTICLE && args?.content?.length < 3) {
    throwError(
      UserInputError,
      "Post Description should be more than 3 characters"
    );
  } else if (!args?.type) {
    throwError(UserInputError, "Please select the post type");
  } else if (!args.communityId) {
    throwError(UserInputError, "Please select community");
  }
};

export const validateUpdatePostArgs = (args: IUpdatePostArgs) => {
  if (!args.postId) {
    throwError(UserInputError, "postId is required");
  } else if (!args.content) {
    throwError(UserInputError, "content is required");
  }
};

export const validateUpdatePostScore = (args: IUpdatePostScoreArgs) => {
  if (!args.postId) {
    throwError(UserInputError, "postId is required");
  } else if (!args.direction) {
    throwError(UserInputError, "direction is required");
  }
};

export const validateDeletePostArgs = (args: IDeletePostArgs) => {
  if (!args.postId) {
    throwError(UserInputError, "postId is required");
  }
};
