import { defineAstroPaperConfig } from "./src/types/config";

export default defineAstroPaperConfig({
  site: {
    url: "https://222382.xyz/",
    title: "Velox",
    description: "Velox 的个人博客",
    author: "Velox",
    profile: "https://github.com/VeloxSpace",
    ogImage: "astropaper-og.jpg",
    lang: "zh-CN",
    timezone: "Asia/Shanghai",
    dir: "ltr",
  },
  posts: {
    perPage: 3,
    perIndex: 4,
  },
  features: {
    lightAndDarkMode: true,
    dynamicOgImage: true,
    showArchives: true,
    showBackButton: true,
    editPost: {
      enabled: true,
      // NOTE: v7 appends the post's file path (src/content/posts/xxx.md)
      // to this URL, so it must be the repo-root edit URL with a trailing
      // slash — NOT the posts folder itself, or the path doubles up.
      url: "https://github.com/VeloxSpace/my-blog/edit/main/",
    },
    search: "pagefind",
    toc: true,
  },
  socials: [
    { name: "github", url: "https://github.com/VeloxSpace" },
    { name: "mail", url: "mailto:velox@muse.ai" },
    { name: "telegram", url: "https://t.me/Velox95" },
  ],
  shareLinks: [
    { name: "whatsapp", url: "https://wa.me/?text=" },
    { name: "facebook", url: "https://www.facebook.com/sharer.php?u=" },
    { name: "x", url: "https://x.com/intent/post?url=" },
    { name: "telegram", url: "https://t.me/share/url?url=" },
    { name: "pinterest", url: "https://pinterest.com/pin/create/button/?url=" },
    { name: "mail", url: "mailto:?subject=See%20this%20post&body=" },
  ],
});
