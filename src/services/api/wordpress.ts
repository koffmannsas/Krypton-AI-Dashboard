export interface WordPressConfig {
  url: string;
  username: string;
  appPassword: string;
}

export const publishToWordPress = async (config: WordPressConfig, article: any) => {
  const { url, username, appPassword } = config;
  const endpoint = `${url.replace(/\/$/, '')}/wp-json/wp/v2/posts`;
  
  // Basic Auth for WordPress REST API
  const auth = Buffer.from(`${username}:${appPassword}`).toString('base64');
  
  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${auth}`
      },
      body: JSON.stringify({
        title: article.title,
        content: article.content,
        status: article.status === 'scheduled' ? 'future' : 'publish',
        date: article.scheduledDate ? new Date(article.scheduledDate).toISOString() : undefined,
        excerpt: article.metaDescription,
        slug: article.slug,
        meta: {
          _yoast_wpseo_metadesc: article.metaDescription,
          _yoast_wpseo_focuskw: article.mainKeyword,
          // Support for other SEO plugins if needed
          rank_math_description: article.metaDescription,
          rank_math_focus_keyword: article.mainKeyword
        }
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `WordPress API returned ${response.status}`);
    }

    return await response.json();
  } catch (error: any) {
    console.error("❌ WordPress Publishing Error:", error.message);
    throw error;
  }
};
