export function gql(strings, ...args) {
  let str = "";
  strings.forEach((string, i) => {
    str += string + (args[i] || "");
  });
  return str;
}
export const HomePartsFragmentDoc = gql`
    fragment HomeParts on Home {
  __typename
  hero {
    __typename
    logo
    title
    subtitle
    taglines {
      __typename
      text
    }
    scripture
    scriptureRef
    ctas {
      __typename
      label
      href
      primary
    }
  }
  nav {
    __typename
    links {
      __typename
      label
      href
    }
  }
  sections {
    __typename
    ... on HomeSectionsListSection {
      heading
      intro
      introEmphasis
      groups {
        __typename
        lead
        items {
          __typename
          text
        }
      }
      closing
      closingEmphasis
      scripture
      scriptureRef
      background
      cta {
        __typename
        label
        href
      }
    }
  }
}
    `;
export const PagePartsFragmentDoc = gql`
    fragment PageParts on Page {
  __typename
  title
  intro {
    __typename
    src
    poster
    startHoldSeconds
    holdSeconds
    mobileFocus
  }
  sections {
    __typename
    ... on PageSectionsListSection {
      heading
      intro
      introEmphasis
      groups {
        __typename
        lead
        items {
          __typename
          text
        }
      }
      closing
      closingEmphasis
      scripture
      scriptureRef
      background
      cta {
        __typename
        label
        href
      }
    }
    ... on PageSectionsFrameworkSection {
      heading
      intro
      introEmphasis
      items {
        __typename
        marker
        title
        description
        points
        scriptureRef
      }
      closing
      closingEmphasis
      background
      animate
    }
    ... on PageSectionsBenefitsSection {
      heading
      benefits
      scripture
      scriptureRef
      cta {
        __typename
        label
        href
      }
      background
      animate
    }
    ... on PageSectionsPathsSection {
      heading
      tiers {
        __typename
        badge
        name
        subtitle
        popular
        accent
        idealFor
        features
        priceInFull
        paymentOptions
      }
      cta {
        __typename
        label
        href
      }
      closing
      closingEmphasis
      background
      animate
    }
    ... on PageSectionsFounderSection {
      heading
      headingSmall
      photo
      photo1B
      photo1C
      intro
      struggles
      afterList
      quote
      afterQuote
      afterQuoteEmphasis
      scriptures {
        __typename
        text
        ref
      }
      closing
      closingEmphasis
      background
      animate
    }
    ... on PageSectionsVideoRevealSection {
      video
      poster
      revealHeading
      revealSubtext
      revealSubtextEmphasis
      ctas {
        __typename
        label
        href
        primary
      }
      logo
      background
    }
  }
}
    `;
export const HomeDocument = gql`
    query home($relativePath: String!) {
  home(relativePath: $relativePath) {
    ... on Document {
      _sys {
        filename
        basename
        hasReferences
        breadcrumbs
        path
        relativePath
        extension
      }
      id
    }
    ...HomeParts
  }
}
    ${HomePartsFragmentDoc}`;
export const HomeConnectionDocument = gql`
    query homeConnection($before: String, $after: String, $first: Float, $last: Float, $sort: String, $filter: HomeFilter) {
  homeConnection(
    before: $before
    after: $after
    first: $first
    last: $last
    sort: $sort
    filter: $filter
  ) {
    pageInfo {
      hasPreviousPage
      hasNextPage
      startCursor
      endCursor
    }
    totalCount
    edges {
      cursor
      node {
        ... on Document {
          _sys {
            filename
            basename
            hasReferences
            breadcrumbs
            path
            relativePath
            extension
          }
          id
        }
        ...HomeParts
      }
    }
  }
}
    ${HomePartsFragmentDoc}`;
export const PageDocument = gql`
    query page($relativePath: String!) {
  page(relativePath: $relativePath) {
    ... on Document {
      _sys {
        filename
        basename
        hasReferences
        breadcrumbs
        path
        relativePath
        extension
      }
      id
    }
    ...PageParts
  }
}
    ${PagePartsFragmentDoc}`;
export const PageConnectionDocument = gql`
    query pageConnection($before: String, $after: String, $first: Float, $last: Float, $sort: String, $filter: PageFilter) {
  pageConnection(
    before: $before
    after: $after
    first: $first
    last: $last
    sort: $sort
    filter: $filter
  ) {
    pageInfo {
      hasPreviousPage
      hasNextPage
      startCursor
      endCursor
    }
    totalCount
    edges {
      cursor
      node {
        ... on Document {
          _sys {
            filename
            basename
            hasReferences
            breadcrumbs
            path
            relativePath
            extension
          }
          id
        }
        ...PageParts
      }
    }
  }
}
    ${PagePartsFragmentDoc}`;
export function getSdk(requester) {
  return {
    home(variables, options) {
      return requester(HomeDocument, variables, options);
    },
    homeConnection(variables, options) {
      return requester(HomeConnectionDocument, variables, options);
    },
    page(variables, options) {
      return requester(PageDocument, variables, options);
    },
    pageConnection(variables, options) {
      return requester(PageConnectionDocument, variables, options);
    }
  };
}
import { createClient } from "tinacms/dist/client";
const generateRequester = (client) => {
  const requester = async (doc, vars, options) => {
    let url = client.apiUrl;
    if (options?.branch) {
      const index = client.apiUrl.lastIndexOf("/");
      url = client.apiUrl.substring(0, index + 1) + options.branch;
    }
    const data = await client.request({
      query: doc,
      variables: vars,
      url
    }, options);
    return { data: data?.data, errors: data?.errors, query: doc, variables: vars || {} };
  };
  return requester;
};
export const ExperimentalGetTinaClient = () => getSdk(
  generateRequester(
    createClient({
      url: "http://localhost:4001/graphql",
      queries
    })
  )
);
export const queries = (client) => {
  const requester = generateRequester(client);
  return getSdk(requester);
};
