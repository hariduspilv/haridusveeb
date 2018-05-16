import gql from 'graphql-tag';

export class NewsGraph {

  buildList(lang, offset, limit) {

    lang = lang.toUpperCase();

    return gql`
      query{
        nodeQuery(offset: ${offset}, limit: ${limit}, sort: {field: "created", direction: DESC}, filter: {conditions: [{operator: EQUAL, field: "type", value: ["news"], language: ${lang}}]}) {
          entities {
            entityTranslation(language: ${lang}) {
              ... on NodeNews {
                entityLabel
                created
                entityUrl {
                  ... on EntityCanonicalUrl {
                    path
                    languageSwitchLinks {
                      active
                      title
                    }
                  }
                }
                fieldShortDescription
                fieldAuthor
                fieldIntroductionImage {
                  url
                  alt
                }
                fieldNewsTag {
                  entity {
                    entityLabel
                  }
                }
              }
            }
          }
        }
      }
    `;
  }

  buildSingle(lang, path) {

    lang = lang.toUpperCase();
    return gql`
    query{
      route(path:"${path}"){
        ... on EntityCanonicalUrl{
          languageSwitchLinks {
            active
            title
            language {
              id
            }
            url {
              path
              routed
              pathAlias
              pathInternal
            }
          }
          entity{
            ... on NodeNews {
              entityLabel
              nid
              created
              fieldAuthor
              fieldNewsDescription {
                value
              }
              fieldShortDescription
              fieldIntroductionImage {
                url
                alt
              }
              fieldAdditionalImages{
                derivative(style:CUSTOM_CROP_STYLE_16_9_){
                  url 
                }
                alt
              }
              fieldNewsLink {
                url {
                  path
                }
                title
              }
              fieldNewsTag{
                entity{
                  entityLabel
                  tid
                }
              }
              entityUrl {
                ... on EntityCanonicalUrl {
                  languageSwitchLinks {
                    url {
                      routed
                      path
                      pathAlias
                      pathInternal
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
    `;
  }

  buildRecent(nid, lang) {

    lang = lang.toUpperCase();

    return gql`
    query{
      nodeQuery(limit: 3, sort: {field: "created", direction: DESC}, filter: {conditions: [{operator: EQUAL, field: "type", value: ["news"], language: ${lang} }, {operator: NOT_EQUAL, field: "nid", value: ["${nid}"], language:${lang}}]}) {
        entities {
          entityTranslation(language: ${lang}) {
            ... on NodeNews {
              entityLabel
              created
              fieldShortDescription
              entityUrl {
                ... on EntityCanonicalUrl {
                  path
                  languageSwitchLinks {
                    url {
                      path
                    }
                  }
                }
              }
            }
          }
        }
      }
    }    
    `;
  }
}



// query{
//   nodeQuery(
//     offset: 0, 
//     limit: 10, 
//     sort: {field: "created", direction: DESC}, 
//     filter: {
//       conditions: [{operator: EQUAL, field: "type", value: ["news"], language: ET}]}) {
//     entities {
//       entityTranslation(language: ET) {
//         ... on NodeNews {
//           entityLabel
//           created
//           entityUrl {
//             ... on EntityCanonicalUrl {
//               path
//               languageSwitchLinks {
//                 active
//                 title
//               }
//             }
//           }
//           fieldShortDescription
//           fieldAuthor
//           fieldIntroductionImage {
//             url
//             alt
//           }
//           fieldNewsTag {
//             entity {
//               entityLabel
//             }
//           }
//         }
//       }
//     }
//   }
// }



// sildi jargi

// {
//   nodeQuery(offset: 0, limit: 10, sort: {field: "created", direction: DESC},
//     filter: {conditions: [
//       {operator: EQUAL, field: "type", value: ["news"], language: ET},
//       {operator: EQUAL, field: "field_news_tag.entity.tid", value: ["21"], language: ET}
//     ]}) {
//     entities {
//       entityTranslation(language: ET) {
//         ... on NodeNews {
//           entityLabel
//           created
//           entityUrl {
//             ... on EntityCanonicalUrl {
//               path
//               languageSwitchLinks {
//                 active
//                 title
//               }
//             }
//           }
//           fieldShortDescription
//           fieldAuthor
//           fieldIntroductionImage {
//             url
//             alt
//           }
//           fieldNewsTag {
//             entity {
//               entityLabel
//               tid
//             }
//           }
//         }
//       }
//     }
//   }
// }
