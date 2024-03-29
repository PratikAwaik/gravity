import * as React from "react";
import Head from "next/head";
import DisplayError from "../../components/Utils/DisplayError";
import { useMutation } from "@apollo/client";
import { useRouter } from "next/router";
import { CREATE_COMMUNITY } from "../../graphql/community/mutations";
import { getCommunityDetailPath } from "../../utils/constants";
import { useAuth } from "../../utils/Auth";
import { TypeNames } from "../../models/utils";
import Button, { ButtonVariant } from "../../components/Common/Button";

/**
 * TODO:
 * Add community Icon
 * redirect to subreddit detail page
 */

export default function CreateCommunity() {
  const [subreddit, setSubreddit] = React.useState({
    name: "",
    description: "",
    icon: null,
  });
  const [error, setError] = React.useState<Record<string, string> | null>(null);
  const { currentUser } = useAuth();
  const [createSubreddit, { loading }] = useMutation(CREATE_COMMUNITY, {
    update: (cache, { data: createCommunity }) => {
      if (createCommunity?.adminId === currentUser?.id) {
        cache.modify({
          id: cache.identify({
            __typename: TypeNames.USER,
            id: currentUser?.id,
          }),
          fields: {
            karma: (existingKarma = 0) => existingKarma + 10,
          },
        });
      }
    },
    onError: (error) => {
      setError({
        message: error.graphQLErrors[0].message,
        field: (error.graphQLErrors[0].extensions.field as string) ?? null,
      });
    },
    onCompleted: (data) => {
      router.push(getCommunityDetailPath(data?.createCommunity?.name));
    },
  });
  const router = useRouter();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    createSubreddit({ variables: subreddit });
  };

  return (
    <>
      <Head>
        <title>Create Community</title>
      </Head>
      <div className="mt-5 py-6 px-4 rounded-md max-w-3xl mx-auto mb-20 bg-white">
        <div className="mb-4">
          <h2 className="text-lg mb-3 rounded-md font-medium">
            Create Community
          </h2>
          <div className="w-full h-0.5 border border-b-theme-gray-line"></div>
        </div>
        <div>
          <form onSubmit={handleSubmit}>
            {/* Add Community icon */}
            <fieldset className="flex flex-col items-start mb-4">
              <label
                htmlFor="subreddit-name"
                className="mb-1 text-sm required ml-1"
              >
                Name
              </label>
              <div className="w-full flex items-center text-sm border border-theme-gray-line rounded-md hover:border-theme-nav-icon focus-within:border-theme-nav-icon">
                <span className="pl-4 text-sm">c/</span>
                <input
                  onChange={({ target }) =>
                    setSubreddit({ ...subreddit, name: target.value })
                  }
                  name="name"
                  type="text"
                  id="subreddit-name"
                  minLength={3}
                  maxLength={21}
                  pattern="^[a-zA-Z0-9_]+$"
                  value={subreddit.name}
                  className="resize-none overflow-hidden text-sm w-full p-2 border-none rounded-md outline-none"
                  required
                  autoComplete="off"
                  placeholder="Name of the Community"
                />
                <span className="text-xs font-medium mx-2 whitespace-nowrap text-theme-gray-action-icon">
                  {subreddit.name.length} / 21
                </span>
              </div>

              {error?.field === "name" && (
                <DisplayError error={error?.message ?? ""} />
              )}

              <div className="flex items-start mt-2 text-theme-gray-action-icon font-medium">
                <i className="ri-information-line mr-2 text-lg"></i>
                <span className="text-xs sm:text-md">
                  Names cannot have spaces (e.g. "r/bookclub" not "r/book
                  club"), must be between 3-21 characters, and underscores ("_")
                  are the only special characters allowed.
                </span>
              </div>
            </fieldset>

            <fieldset className="flex flex-col items-start mb-4">
              <label
                htmlFor="subreddit-description"
                className="mb-1 text-sm required ml-1"
              >
                Description
              </label>
              <textarea
                onChange={({ target }) =>
                  setSubreddit({ ...subreddit, description: target.value })
                }
                value={subreddit.description}
                rows={5}
                required
                minLength={10}
                className="resize-none overflow-auto text-sm w-full p-2 bg-transparent border border-theme-gray-line rounded-md outline-none hover:border-theme-nav-icon focus-within:border-theme-nav-icon"
              ></textarea>
              {error?.field === "description" && (
                <DisplayError error={error?.message ?? ""} />
              )}
            </fieldset>

            <div className="flex items-center mt-5 gap-2">
              <Button
                onClick={() => router.back()}
                variant={ButtonVariant.SECONDARY}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Creating..." : "Create Community"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
