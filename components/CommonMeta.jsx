import Head from "next/head";

export default function CommonMeta() {
  return (
    <Head>
      <meta charSet="UTF-8" />
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0, user-scalable=yes"
      />
      <meta name="author" content="Ankur Halder" />
      <meta name="robots" content="index, follow" />
      <meta property="og:image" content="/icons/favicon-96x96.png" />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="Eduversa" />
      <link rel="dns-prefetch" href="https://www.eduversa.in/" />
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="black" />
      <meta name="geo.placename" content="Kolkata, West Bengal, India" />
      <meta name="geo.position" content="22.476632;88.322844" />
      <meta name="geo.region" content="IN-WB" />
      <meta name="language" content="en" />
      <meta name="target" content="all" />
      <meta name="HandheldFriendly" content="True" />
      <meta name="MobileOptimized" content="450" />
      <meta
        name="DC.Description"
        content="Discover Eduversa: the ultimate student management solution."
      />
      <meta name="pinterest-rich-pin" content="true" />
      <meta name="rating" content="general" />

      <meta
        name="keywords"
        content="education, management, students, school, college"
      />
      <meta name="theme-color" content="#ffffff" />
      <meta name="referrer" content="origin-when-cross-origin" />
      <meta
        name="google-site-verification"
        content="ZQ7y2oT7kIhS-ULWuKP2gnBzUbKy7lk_IQexK0jZ1fE"
      />
    </Head>
  );
}
