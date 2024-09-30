import React, { useState, useEffect } from "react";
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { createMockPost, fetchMockPostsPaginated } from "./data";

const Posts = () => {
  const queryClient = useQueryClient();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const limit = 5;

  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["posts"],
    queryFn: ({ pageParam = 1 }) => fetchMockPostsPaginated(pageParam, limit),
    getNextPageParam: (lastPage, pages) => {
      return lastPage.hasMore ? pages.length + 1 : undefined;
    },
    initialPageParam: 1,
  });

  const mutation = useMutation({
    mutationFn: createMockPost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate({
      title,
      body,
      userId: 1,
      id: Date.now(),
    });
    setTitle("");
    setBody("");
  };

  // Load more posts when button is clicked
  const loadMorePosts = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading posts</div>;

  return (
    <div>
      <h1>Posts</h1>

      <form onSubmit={handleSubmit}>
        <div>
          <input
            type="text"
            placeholder="Post title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div>
          <textarea
            placeholder="Post body"
            value={body}
            onChange={(e) => setBody(e.target.value)}
          />
        </div>
        <button type="submit">Create Post</button>
      </form>

      {data?.pages.map((page, pageIndex) => (
        <ul key={pageIndex}>
          {page.posts.map((post) => (
            <li key={post.id}>
              <h3>{post.title}</h3>
              <p>{post.body}</p>
            </li>
          ))}
        </ul>
      ))}

      {/* Load More Button */}
      <div>
        {isFetchingNextPage ? (
          <p>Loading more...</p>
        ) : hasNextPage ? (
          <button onClick={loadMorePosts}>Load More</button>
        ) : (
          <p>No more posts to load</p>
        )}
      </div>
    </div>
  );
};

const App = () => {
  return (
    <div>
      <Posts />
    </div>
  );
};

export default App;
