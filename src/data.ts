export type Post = {
  id: number;
  title: string;
  body: string;
  userId: number;
};

// I did not wanted to write 15 posts so I made simple function:

const generateMockPosts = (limit: number): Post[] => {
  const posts: Post[] = [];
  for (let i = 1; i <= limit; i++) {
    posts.push({
      id: i,
      title: `Mock Post ${i}`,
      body: `This is the body of Mock Post ${i}`,
      userId: (i % 3) + 1,
    });
  }
  return posts;
};

let posts: Post[] = generateMockPosts(50);

export const fetchMockPostsPaginated = async (page: number, limit: number) => {
  return new Promise<{ posts: Post[]; hasMore: boolean }>((resolve) => {
    setTimeout(() => {
      const startIndex = (page - 1) * limit;
      const endIndex = page * limit;
      const paginatedPosts = posts.slice(startIndex, endIndex);
      const hasMore = endIndex < posts.length;
      resolve({ posts: paginatedPosts, hasMore });
    }, 500);
  });
};

export const fetchMockPostById = async (
  id: number
): Promise<Post | undefined> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const post = posts.find((post) => post.id === id);
      resolve(post);
    }, 2200);
  });
};

export const createMockPost = async (post: Post): Promise<Post> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      posts = [...posts, post];
      resolve(post);
    }, 500);
  });
};
