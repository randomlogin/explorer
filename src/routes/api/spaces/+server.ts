import db from '$lib/db';
import { error, json } from '@sveltejs/kit';
import { type RequestHandler } from '@sveltejs/kit';
import { sql, asc, desc } from 'drizzle-orm';
// import { spaces, spacesHistory, blockStats } from '$lib/schema';
import { vmetaouts, blocks,  spacesHistory } from '$lib/schema';

export const GET: RequestHandler = async function ({ request, url }) {
    const status = url.searchParams.get('status');
    const sortBy = url.searchParams.get('sort');
    const direction = url.searchParams.get('direction');

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let orderBy: any;

    const fakedata = [
  {
    "id": 191,
    "name": "@bitcoin",
    "nameSha256": "313c12391a309b7bcf617a2a5a17d18eb45fa7dd8c683a12c49a97af5937fad8",
    "status": "registered",
    "bid_amount": 3000,
    "claimHeight": 40489,
    "spacesHistoryId": 587,
    "createdAt": "2024-10-02T20:52:14.525Z",
    "updatedAt": "2024-10-02T20:52:22.335Z",
    "rank": "1",
    "history": [
      {
        "id": 481,
        "action": "bid",
        "bid_amount": 1000,
        "transaction": {
          "id": 637,
          "txid": "8a8c7ecb0bdc24e0be2df19f5a24b88688c198c56e4537048fc93c5ee23c6c68",
          "block": {
            "time": 1723247881
          }
        }
      },
      {
        "id": 482,
        "action": "bid",
        "bid_amount": 2000,
        "transaction": {
          "id": 641,
          "txid": "424a888a1634336d14b88dbec9b8b38f97607321ae33bdd9b473ab6f3945e2cd",
          "block": {
            "time": 1723251543
          }
        }
      },
      {
        "id": 483,
        "action": "rollout",
        "bid_amount": null,
        "transaction": {
          "id": 642,
          "txid": "0a31e956d7d2df54a5151e9b836f09022d4732fe557a3dda2c66129a7df0f6f3",
          "block": {
            "time": 1723299623
          }
        }
      },
      {
        "id": 486,
        "action": "bid",
        "bid_amount": 2500,
        "transaction": {
          "id": 653,
          "txid": "a36a0e00d6c4084414049cf2559f27cfd4b0e92e72d1496c5e22c8922bd9ae0e",
          "block": {
            "time": 1723838858
          }
        }
      },
      {
        "id": 489,
        "action": "bid",
        "bid_amount": 2777,
        "transaction": {
          "id": 656,
          "txid": "b2423e4e75ab96257222a883a462ab1f42e98bfb0d1dcf2352a16b890cbe7265",
          "block": {
            "time": 1723908277
          }
        }
      },
      {
        "id": 566,
        "action": "bid",
        "bid_amount": 3000,
        "transaction": {
          "id": 754,
          "txid": "1801197ed9693c5e4f07ed3a8fdd52b04c9bd3e5c1a1ddea3857947b6f147e3f",
          "block": {
            "time": 1724098163
          }
        }
      },
      {
        "id": 587,
        "action": "transfer",
        "bid_amount": null,
        "transaction": {
          "id": 776,
          "txid": "b2819258b2416314a36e8f66840ebb5682e2600a07c28a04b4e27fe0b51b46fc",
          "block": {
            "time": 1724178353
          }
        }
      }
    ]
  },
  {
    "id": 282,
    "name": "@time",
    "nameSha256": "69bb7f5366d1b9bc8effd0487fe1a031e3a8ecd59ffaca2faee04908f06c6507",
    "status": "registered",
    "bid_amount": 2112,
    "claimHeight": 42841,
    "spacesHistoryId": 902,
    "createdAt": "2024-10-02T20:52:26.446Z",
    "updatedAt": "2024-10-02T20:52:35.319Z",
    "rank": "2",
    "history": [
      {
        "id": 673,
        "action": "bid",
        "bid_amount": 1000,
        "transaction": {
          "id": 861,
          "txid": "f3df8bd036257bb1171c33a722f4e32798578a206194e07dc31c4ec8e3517faf",
          "block": {
            "time": 1724646033
          }
        }
      },
      {
        "id": 681,
        "action": "rollout",
        "bid_amount": null,
        "transaction": {
          "id": 870,
          "txid": "b9fe9b1a38d89a648ef6296bf54ae8514dcbbaaf4c38ac0b3dc0a3698cf45690",
          "block": {
            "time": 1724752162
          }
        }
      },
      {
        "id": 685,
        "action": "bid",
        "bid_amount": 2001,
        "transaction": {
          "id": 876,
          "txid": "8554927962acfedebcd0e63be6e28055cd56f699e0be59d86f45fea7d95021ec",
          "block": {
            "time": 1724783867
          }
        }
      },
      {
        "id": 893,
        "action": "bid",
        "bid_amount": 2112,
        "transaction": {
          "id": 1162,
          "txid": "7b88fcd4ac884738282ef8e5930b0a2f665b679ede5e3290530c395348e382c5",
          "block": {
            "time": 1725556861
          }
        }
      },
      {
        "id": 902,
        "action": "transfer",
        "bid_amount": null,
        "transaction": {
          "id": 1164,
          "txid": "129f9abaa53b478bae6c34088b7c64412f8930d7940e9d3e7d5bca90941bb7a8",
          "block": {
            "time": 1725633267
          }
        }
      }
    ]
  },
  {
    "id": 197,
    "name": "@nostr",
    "nameSha256": "4d3f03e065df3b6fe7aa4666969e97d5254ed167b8375f2b84b93a39bfe7fe4a",
    "status": "registered",
    "bid_amount": 2001,
    "claimHeight": 41747,
    "spacesHistoryId": 691,
    "createdAt": "2024-10-02T20:52:19.419Z",
    "updatedAt": "2024-10-02T20:52:29.266Z",
    "rank": "3",
    "history": [
      {
        "id": 495,
        "action": "bid",
        "bid_amount": 1000,
        "transaction": {
          "id": 668,
          "txid": "f26225824c21e670ea6174b37201762a8991d9073a9efaa99f6162b14ff9b9b3",
          "block": {
            "time": 1723908277
          }
        }
      },
      {
        "id": 516,
        "action": "rollout",
        "bid_amount": null,
        "transaction": {
          "id": 696,
          "txid": "748b434660b2026ece4275ad25e730a27321656b638c4e3929f65dcff689d1d2",
          "block": {
            "time": 1723926719
          }
        }
      },
      {
        "id": 684,
        "action": "bid",
        "bid_amount": 1999,
        "transaction": {
          "id": 874,
          "txid": "60fbfacd80846bd1a518ac57a919af3f99880b8ff6080d5d3321cd7cfa3bdb3d",
          "block": {
            "time": 1724782666
          }
        }
      },
      {
        "id": 688,
        "action": "bid",
        "bid_amount": 2001,
        "transaction": {
          "id": 881,
          "txid": "b0b70997d7b5ac062e070713baf90829be27f0944155ee9c8706b8475d89fe84",
          "block": {
            "time": 1724909258
          }
        }
      },
      {
        "id": 691,
        "action": "transfer",
        "bid_amount": null,
        "transaction": {
          "id": 887,
          "txid": "a23c1d3d82face76682aeb8c33543111e1a1f06ef9c022b432d3203e39731d49",
          "block": {
            "time": 1724972709
          }
        }
      }
    ]
  },
  {
    "id": 281,
    "name": "@now",
    "nameSha256": "838feddeeea69de4e6b88859a21dcc21ff0504d85e1ed718cca028c190125846",
    "status": "registered",
    "bid_amount": 2000,
    "claimHeight": 42828,
    "spacesHistoryId": 909,
    "createdAt": "2024-10-02T20:52:26.446Z",
    "updatedAt": "2024-10-02T20:52:59.158Z",
    "rank": "4",
    "history": [
      {
        "id": 672,
        "action": "bid",
        "bid_amount": 1000,
        "transaction": {
          "id": 859,
          "txid": "46c50a682a7ac61b499da4577b6009646124ca60de6cb1cee09d40ac9b1d0c58",
          "block": {
            "time": 1724646033
          }
        }
      },
      {
        "id": 679,
        "action": "rollout",
        "bid_amount": null,
        "transaction": {
          "id": 870,
          "txid": "b9fe9b1a38d89a648ef6296bf54ae8514dcbbaaf4c38ac0b3dc0a3698cf45690",
          "block": {
            "time": 1724752162
          }
        }
      },
      {
        "id": 879,
        "action": "bid",
        "bid_amount": 2000,
        "transaction": {
          "id": 1097,
          "txid": "a691353029300ae482551cc36977160e9aa13110dfbe214a418b4bfab9a77358",
          "block": {
            "time": 1725541244
          }
        }
      },
      {
        "id": 909,
        "action": "transfer",
        "bid_amount": null,
        "transaction": {
          "id": 1210,
          "txid": "20653d96ea8283e04a849ce7681ddb5e2daefcf4d6d301af8c0da6700e34fb39",
          "block": {
            "time": 1727736050
          }
        }
      }
    ]
  },
  {
    "id": 404,
    "name": "@mytest15",
    "nameSha256": "22800eed53b0601a331492b1726950d693011fb4d9a61ddf02d8a606244cbdaf",
    "status": "auction",
    "bid_amount": 1555,
    "claimHeight": 52417,
    "spacesHistoryId": 1079,
    "createdAt": "2024-10-19T12:42:00.206Z",
    "updatedAt": "2024-10-20T05:45:00.521Z",
    "rank": "5",
    "history": [
      {
        "id": 1078,
        "action": "bid",
        "bid_amount": 1555,
        "transaction": {
          "id": 1415,
          "txid": "2dc6f04cfc2eb354d637b89a22f539846b8cc29babe2bd174ff10c3d2bc97323",
          "block": {
            "time": 1729341684
          }
        }
      },
      {
        "id": 1079,
        "action": "rollout",
        "bid_amount": null,
        "transaction": {
          "id": 1416,
          "txid": "72cc2548c188250668d98cdd0e48b3333a01ebc33d305a4f5236423ca62b800f",
          "block": {
            "time": 1729403090
          }
        }
      }
    ]
  },
  {
    "id": 297,
    "name": "@bucket",
    "nameSha256": "70748d33571b35708cc7890afb7caa4d65ea47b2aca70fe86ffb9aaa9e1d5e17",
    "status": "registered",
    "bid_amount": 1500,
    "claimHeight": 43489,
    "spacesHistoryId": 908,
    "createdAt": "2024-10-02T20:52:29.500Z",
    "updatedAt": "2024-10-02T20:52:59.158Z",
    "rank": "6",
    "history": [
      {
        "id": 713,
        "action": "bid",
        "bid_amount": 1000,
        "transaction": {
          "id": 920,
          "txid": "1911a5cad823135e8cd7912df8b18d2067d1da7a3d15658b59520d7f2f53dd29",
          "block": {
            "time": 1724984665
          }
        }
      },
      {
        "id": 772,
        "action": "rollout",
        "bid_amount": null,
        "transaction": {
          "id": 980,
          "txid": "a597bd6da3574cba043c317748ecab5bd64534c5daffa78a5e7f8ac0e7403bd9",
          "block": {
            "time": 1725089125
          }
        }
      },
      {
        "id": 880,
        "action": "bid",
        "bid_amount": 1500,
        "transaction": {
          "id": 1099,
          "txid": "1419a42989af2349dbd86a00176fa589edac4e0e98f8df88fcd8ab0ae3184049",
          "block": {
            "time": 1725541244
          }
        }
      },
      {
        "id": 908,
        "action": "transfer",
        "bid_amount": null,
        "transaction": {
          "id": 1209,
          "txid": "3337aa64cd5caa8176fe36e3af959a749acbda349b1116750d4baf5f8e397ae4",
          "block": {
            "time": 1727736050
          }
        }
      }
    ]
  },
  {
    "id": 286,
    "name": "@phaedrus",
    "nameSha256": "4b565d1976c26231f5a002323b389b05933992bfd79e8eb40d361a2e67b71778",
    "status": "registered",
    "bid_amount": 1234,
    "claimHeight": 42913,
    "spacesHistoryId": 903,
    "createdAt": "2024-10-02T20:52:27.363Z",
    "updatedAt": "2024-10-02T20:52:35.606Z",
    "rank": "7",
    "history": [
      {
        "id": 683,
        "action": "bid",
        "bid_amount": 1000,
        "transaction": {
          "id": 872,
          "txid": "25d2ffb43553ab2499b1630412fc52f22f701a7b2c81aa4b21defef417df681e",
          "block": {
            "time": 1724780846
          }
        }
      },
      {
        "id": 687,
        "action": "rollout",
        "bid_amount": null,
        "transaction": {
          "id": 879,
          "txid": "6ce96fedc3118475aee9ef05bd699e9e0a1df4d02e9842cf9d8bdb3543fc2f25",
          "block": {
            "time": 1724834983
          }
        }
      },
      {
        "id": 689,
        "action": "bid",
        "bid_amount": 1234,
        "transaction": {
          "id": 883,
          "txid": "749acddbac00b7576bbae6b7733206efadbb0a07f868efd6e71b5ec4d7102572",
          "block": {
            "time": 1724909258
          }
        }
      },
      {
        "id": 903,
        "action": "transfer",
        "bid_amount": null,
        "transaction": {
          "id": 1166,
          "txid": "4ebdfd4b2f45a33073c7d5ecfacb503a604e39b1296a9449f1cc0df88fc24868",
          "block": {
            "time": 1725656491
          }
        }
      },
      {
        "id": 904,
        "action": "transfer",
        "bid_amount": null,
        "transaction": {
          "id": 1167,
          "txid": "585cd13f956f5fc67540036ff905a8f2b5e69ba5345b7908450ba0e138f1ded5",
          "block": {
            "time": 1725658895
          }
        }
      }
    ]
  },
  {
    "id": 193,
    "name": "@a",
    "nameSha256": "16b7de529da4f96b7610c3a1a2b6fe669bba28b26f2be07c7c11c144cf7954ea",
    "status": "registered",
    "bid_amount": 1077,
    "claimHeight": 41934,
    "spacesHistoryId": 766,
    "createdAt": "2024-10-02T20:52:18.816Z",
    "updatedAt": "2024-10-02T20:52:30.684Z",
    "rank": "8",
    "history": [
      {
        "id": 485,
        "action": "bid",
        "bid_amount": 1000,
        "transaction": {
          "id": 651,
          "txid": "8296127c41e46cfaba72f439919e6252fec12318632194b3b2a970b3ab8c4d1b",
          "block": {
            "time": 1723838858
          }
        }
      },
      {
        "id": 487,
        "action": "rollout",
        "bid_amount": null,
        "transaction": {
          "id": 654,
          "txid": "d65905b4ce260956df548627113499b842f6ae3ebdad35ef7f6585ed8ce0585e",
          "block": {
            "time": 1723861506
          }
        }
      },
      {
        "id": 490,
        "action": "bid",
        "bid_amount": 1001,
        "transaction": {
          "id": 658,
          "txid": "361be5a4a273d139ea328f42b7698b6e79c45a7b416c671290be81ef98990908",
          "block": {
            "time": 1723908277
          }
        }
      },
      {
        "id": 686,
        "action": "bid",
        "bid_amount": 1040,
        "transaction": {
          "id": 878,
          "txid": "bdc49b32fad0b1b075d81755156badf188c7d1ad5364723af36bf897fde0506a",
          "block": {
            "time": 1724783867
          }
        }
      },
      {
        "id": 719,
        "action": "bid",
        "bid_amount": 1077,
        "transaction": {
          "id": 932,
          "txid": "c3c70aece906dd36aeb11f514c0c05af7fc534644c05d63ddcf25f73d8fa6590",
          "block": {
            "time": 1724985490
          }
        }
      },
      {
        "id": 766,
        "action": "transfer",
        "bid_amount": null,
        "transaction": {
          "id": 979,
          "txid": "4ab1fbacef91dbc808543ef8cad27026d9d9e58468354a5ab28127ad2173e2d3",
          "block": {
            "time": 1725071514
          }
        }
      }
    ]
  },
  {
    "id": 207,
    "name": "@ai",
    "nameSha256": "dec326f17068c89204e2922cfd8cf3bcfe65caf1deb00dc39bbd464e2f0c6c00",
    "status": "registered",
    "bid_amount": 1077,
    "claimHeight": 41931,
    "spacesHistoryId": 765,
    "createdAt": "2024-10-02T20:52:19.508Z",
    "updatedAt": "2024-10-02T20:52:30.684Z",
    "rank": "9",
    "history": [
      {
        "id": 505,
        "action": "bid",
        "bid_amount": 1000,
        "transaction": {
          "id": 689,
          "txid": "e87529b6ff17a0983d439a6a4c6b04253e0362ce17f1c1568fe895b7a7f54c01",
          "block": {
            "time": 1723909697
          }
        }
      },
      {
        "id": 515,
        "action": "rollout",
        "bid_amount": null,
        "transaction": {
          "id": 696,
          "txid": "748b434660b2026ece4275ad25e730a27321656b638c4e3929f65dcff689d1d2",
          "block": {
            "time": 1723926719
          }
        }
      },
      {
        "id": 690,
        "action": "bid",
        "bid_amount": 1040,
        "transaction": {
          "id": 886,
          "txid": "5cf66c06c57aa3f6914cff0ea163a56c38ab9acc779014294703edff29a2790e",
          "block": {
            "time": 1724946412
          }
        }
      },
      {
        "id": 718,
        "action": "bid",
        "bid_amount": 1077,
        "transaction": {
          "id": 930,
          "txid": "7bbd6ae8109db0a4cac123cbd5f4e4312036ae38b564663b91e2fd98856e36be",
          "block": {
            "time": 1724984665
          }
        }
      },
      {
        "id": 765,
        "action": "transfer",
        "bid_amount": null,
        "transaction": {
          "id": 978,
          "txid": "b9f71ecd5ed2237c6c6acad0a96d3655ecfcc62059e28b800633f662315c102e",
          "block": {
            "time": 1725071514
          }
        }
      }
    ]
  },
  {
    "id": 342,
    "name": "@relay",
    "nameSha256": "3e832a6bb1086b64f7a95eaba3f20562e0213af5b313e587f5b59d898f9ef952",
    "status": "registered",
    "bid_amount": 1041,
    "claimHeight": 49151,
    "spacesHistoryId": 1000,
    "createdAt": "2024-10-02T20:52:34.413Z",
    "updatedAt": "2024-10-08T15:51:00.726Z",
    "rank": "10",
    "history": [
      {
        "id": 876,
        "action": "bid",
        "bid_amount": 1000,
        "transaction": {
          "id": 1093,
          "txid": "823eca94ed984386e5934c3c02d225a6661a8f0cf50aba52b40ebe5dd1865dc3",
          "block": {
            "time": 1725541244
          }
        }
      },
      {
        "id": 894,
        "action": "rollout",
        "bid_amount": null,
        "transaction": {
          "id": 1163,
          "txid": "bdbf6d1820f81455ffe142efeb5568b4f6ce9b82a769bbe32a053832e8bfdc10",
          "block": {
            "time": 1725583181
          }
        }
      },
      {
        "id": 906,
        "action": "bid",
        "bid_amount": 1040,
        "transaction": {
          "id": 1188,
          "txid": "678ade67f021f70cdcfd3146215672f5e001a0c3adfd839243d183a6df6a63d9",
          "block": {
            "time": 1726524864
          }
        }
      },
      {
        "id": 937,
        "action": "bid",
        "bid_amount": 1041,
        "transaction": {
          "id": 1246,
          "txid": "bfb67636eead4641746037d3ee549727112e0e4c15778403716914397917bd5b",
          "block": {
            "time": 1728319307
          }
        }
      },
      {
        "id": 1000,
        "action": "transfer",
        "bid_amount": null,
        "transaction": {
          "id": 1326,
          "txid": "cef1a479f99faa320355c60b83d4d795a1be6a41aa40c9ba83a444a9f4c8e13d",
          "block": {
            "time": 1728409829
          }
        }
      }
    ]
  },
  {
    "id": 237,
    "name": "@artfuldev",
    "nameSha256": "69ceda6b411fb1f7dca4bdeefba1af85531dbc53cb74fe36eee604b791cc8ff5",
    "status": "registered",
    "bid_amount": 1002,
    "claimHeight": 41905,
    "spacesHistoryId": 821,
    "createdAt": "2024-10-02T20:52:21.601Z",
    "updatedAt": "2024-10-02T20:52:32.466Z",
    "rank": "11",
    "history": [
      {
        "id": 565,
        "action": "bid",
        "bid_amount": 1001,
        "transaction": {
          "id": 752,
          "txid": "25a3f6f3f4774f7dcb4c9ddc6659f6991a12326d80454e0982405e778988a1fa",
          "block": {
            "time": 1724098163
          }
        }
      },
      {
        "id": 567,
        "action": "reject",
        "bid_amount": null,
        "transaction": {
          "id": 756,
          "txid": "b38982ddd21abce52eb17042afe324944a91a98fda2af96370b8aa8459c4f848",
          "block": {
            "time": 1724098163
          }
        }
      },
      {
        "id": 568,
        "action": "reject",
        "bid_amount": null,
        "transaction": {
          "id": 758,
          "txid": "1fca5ab516840e2913affe29fd7324ad0781632a68c746390bb8dfa4b9c4b1bc",
          "block": {
            "time": 1724098163
          }
        }
      },
      {
        "id": 569,
        "action": "bid",
        "bid_amount": 1002,
        "transaction": {
          "id": 760,
          "txid": "fec2a36e34651288dccccc140bf2cf715b2604a1e2b2b5645adfb819131027ec",
          "block": {
            "time": 1724098653
          }
        }
      },
      {
        "id": 570,
        "action": "rollout",
        "bid_amount": null,
        "transaction": {
          "id": 761,
          "txid": "36a384a9080e8f1f5a301919a064cf2725e2d59f886caa88ab697e1f9446788d",
          "block": {
            "time": 1724162284
          }
        }
      },
      {
        "id": 821,
        "action": "transfer",
        "bid_amount": null,
        "transaction": {
          "id": 1042,
          "txid": "de50160457b981046b3a8f4cc6288211f7109fbf69ed7787f954aed3dd102ef2",
          "block": {
            "time": 1725220260
          }
        }
      }
    ]
  },
  {
    "id": 192,
    "name": "@btc",
    "nameSha256": "f3ee07c36de19d5521cd50936596f06a603eb9656e11c487e96e2975bcd3fa9b",
    "status": "registered",
    "bid_amount": 1002,
    "claimHeight": 41394,
    "spacesHistoryId": 724,
    "createdAt": "2024-10-02T20:52:18.816Z",
    "updatedAt": "2024-10-02T20:52:29.562Z",
    "rank": "12",
    "history": [
      {
        "id": 484,
        "action": "bid",
        "bid_amount": 1000,
        "transaction": {
          "id": 649,
          "txid": "792a2fd221e4715d6c4f330fb46309d6f6a7ed4fd0f9c50471b77e643f9885d2",
          "block": {
            "time": 1723838858
          }
        }
      },
      {
        "id": 488,
        "action": "rollout",
        "bid_amount": null,
        "transaction": {
          "id": 654,
          "txid": "d65905b4ce260956df548627113499b842f6ae3ebdad35ef7f6585ed8ce0585e",
          "block": {
            "time": 1723861506
          }
        }
      },
      {
        "id": 491,
        "action": "bid",
        "bid_amount": 1001,
        "transaction": {
          "id": 660,
          "txid": "ae40b3fda5029c1a842be3ec6e38a7c3961a436a8763c4bcde8b56ddd15aa072",
          "block": {
            "time": 1723908277
          }
        }
      },
      {
        "id": 677,
        "action": "bid",
        "bid_amount": 1002,
        "transaction": {
          "id": 869,
          "txid": "43eadd76fdb4e58a7d055ebb73efbddb9e7ac0553d8d58212007c1043848afc4",
          "block": {
            "time": 1724681054
          }
        }
      },
      {
        "id": 724,
        "action": "transfer",
        "bid_amount": null,
        "transaction": {
          "id": 937,
          "txid": "b242c17fe46a9b97a09a64c2166ddf335d2178d495e914d820bee131a8bf6178",
          "block": {
            "time": 1724985490
          }
        }
      }
    ]
  },
  {
    "id": 335,
    "name": "@up",
    "nameSha256": "016e7eb3c36e3f9cad33e6f4d28ad973c29268bd6148f39213f3e0833b7d9638",
    "status": "registered",
    "bid_amount": 1001,
    "claimHeight": 49151,
    "spacesHistoryId": 1001,
    "createdAt": "2024-10-02T20:52:34.112Z",
    "updatedAt": "2024-10-08T15:51:00.726Z",
    "rank": "13",
    "history": [
      {
        "id": 859,
        "action": "bid",
        "bid_amount": 1000,
        "transaction": {
          "id": 1067,
          "txid": "9287b02481cdc4a37fe1529d04df0801002817dfc28e7cb4510b340e92eb4bf9",
          "block": {
            "time": 1725520217
          }
        }
      },
      {
        "id": 862,
        "action": "rollout",
        "bid_amount": null,
        "transaction": {
          "id": 1071,
          "txid": "bb26e001776d28a9276106874dde7dde7ee07fe2d50bc2a4122d08d2761dbbc4",
          "block": {
            "time": 1725521932
          }
        }
      },
      {
        "id": 928,
        "action": "bid",
        "bid_amount": 1001,
        "transaction": {
          "id": 1237,
          "txid": "4dc38543b9e2af19f79d7c2d95276d3eddce4284067f60a1c9f01d64439b1f79",
          "block": {
            "time": 1728319307
          }
        }
      },
      {
        "id": 1001,
        "action": "transfer",
        "bid_amount": null,
        "transaction": {
          "id": 1328,
          "txid": "8010cfd7db6bcb9a4a607fa35a59029d8fb17b3537264d59861263bc045fdc7e",
          "block": {
            "time": 1728409829
          }
        }
      }
    ]
  },
  {
    "id": 303,
    "name": "@beer",
    "nameSha256": "1155a2c70e75346f60a189285941cc85c37598b86d1050e5883ff18483bddb8a",
    "status": "registered",
    "bid_amount": 1001,
    "claimHeight": 49151,
    "spacesHistoryId": 998,
    "createdAt": "2024-10-02T20:52:29.562Z",
    "updatedAt": "2024-10-08T15:51:00.726Z",
    "rank": "14",
    "history": [
      {
        "id": 737,
        "action": "bid",
        "bid_amount": 1000,
        "transaction": {
          "id": 952,
          "txid": "87b09607c64cd8aa1ada6407f03811228f35ce41836dcb1f6e4fcee6ea0ffa4b",
          "block": {
            "time": 1724985490
          }
        }
      },
      {
        "id": 837,
        "action": "rollout",
        "bid_amount": null,
        "transaction": {
          "id": 1044,
          "txid": "39c2aa36c7f805af0f9dd249a1737169be1defe5f0a69da9007f7df9f521526b",
          "block": {
            "time": 1725450337
          }
        }
      },
      {
        "id": 927,
        "action": "bid",
        "bid_amount": 1001,
        "transaction": {
          "id": 1236,
          "txid": "3650adecb2967a77f184629c67342806a5250f3918b3b0aff22801f2b5907505",
          "block": {
            "time": 1728319307
          }
        }
      },
      {
        "id": 998,
        "action": "transfer",
        "bid_amount": null,
        "transaction": {
          "id": 1322,
          "txid": "10eaedcad547e80d5d5fbc4e32423822d1153a43222be7ce5e8343f345bc00ff",
          "block": {
            "time": 1728409829
          }
        }
      }
    ]
  },
  {
    "id": 316,
    "name": "@drag",
    "nameSha256": "47cd7110139e3a04e522a10a9ca07c4ae4fc1bff1b7227c57023bcde50eec414",
    "status": "registered",
    "bid_amount": 1001,
    "claimHeight": 43921,
    "spacesHistoryId": 924,
    "createdAt": "2024-10-02T20:52:31.388Z",
    "updatedAt": "2024-10-07T14:22:00.127Z",
    "rank": "15",
    "history": [
      {
        "id": 792,
        "action": "bid",
        "bid_amount": 1000,
        "transaction": {
          "id": 1003,
          "txid": "455d9a73104520284ca62206ed15ef4dda6eaa232d86aaee84488ab288cca850",
          "block": {
            "time": 1725121917
          }
        }
      },
      {
        "id": 835,
        "action": "rollout",
        "bid_amount": null,
        "transaction": {
          "id": 1044,
          "txid": "39c2aa36c7f805af0f9dd249a1737169be1defe5f0a69da9007f7df9f521526b",
          "block": {
            "time": 1725450337
          }
        }
      },
      {
        "id": 891,
        "action": "bid",
        "bid_amount": 1001,
        "transaction": {
          "id": 1155,
          "txid": "d5315441a84f99953bebd53d133a0ab131c12e79e8445cf6e5f52adc528ab2de",
          "block": {
            "time": 1725541244
          }
        }
      },
      {
        "id": 924,
        "action": "transfer",
        "bid_amount": null,
        "transaction": {
          "id": 1233,
          "txid": "8641852ac385e2e4ac0e1aa1a7ece197fbe08d6961b10d5c40462acc0c0b21f9",
          "block": {
            "time": 1728314204
          }
        }
      }
    ]
  },
  {
    "id": 325,
    "name": "@onion",
    "nameSha256": "4deb1a0376b35470eb0cc51387f9f970f1393b381306f5cf354718baa9f282a0",
    "status": "registered",
    "bid_amount": 1001,
    "claimHeight": 43777,
    "spacesHistoryId": 910,
    "createdAt": "2024-10-02T20:52:31.758Z",
    "updatedAt": "2024-10-02T20:52:59.180Z",
    "rank": "16",
    "history": [
      {
        "id": 801,
        "action": "bid",
        "bid_amount": 1000,
        "transaction": {
          "id": 1022,
          "txid": "0b6e0b3d57c1fb15d419caf35474d17470da3352bd3c64dc44e87ed9318b4e50",
          "block": {
            "time": 1725154762
          }
        }
      },
      {
        "id": 824,
        "action": "rollout",
        "bid_amount": null,
        "transaction": {
          "id": 1043,
          "txid": "6d3e3777b3aaef22cbe5374c1dd946f59fff9821e182ee09bec3ae5a3a855205",
          "block": {
            "time": 1725381834
          }
        }
      },
      {
        "id": 881,
        "action": "bid",
        "bid_amount": 1001,
        "transaction": {
          "id": 1102,
          "txid": "d8f614d5954c866b899be66f1789783b77cbb207c1ec76ad032974e9560fe285",
          "block": {
            "time": 1725541244
          }
        }
      },
      {
        "id": 910,
        "action": "transfer",
        "bid_amount": null,
        "transaction": {
          "id": 1211,
          "txid": "a93421e0d63459840d0f59c49296ba967c6fbc7aa4403748d3a99a704c0552ab",
          "block": {
            "time": 1727738496
          }
        }
      }
    ]
  },
  {
    "id": 333,
    "name": "@p2p",
    "nameSha256": "682b831b9fe813a009bf1469b628fed5979b254aac17b35f191fc9c8b70c6b42",
    "status": "registered",
    "bid_amount": 1001,
    "claimHeight": 43633,
    "spacesHistoryId": 907,
    "createdAt": "2024-10-02T20:52:31.758Z",
    "updatedAt": "2024-10-02T20:52:59.158Z",
    "rank": "17",
    "history": [
      {
        "id": 809,
        "action": "bid",
        "bid_amount": 1000,
        "transaction": {
          "id": 1038,
          "txid": "8bf446154e289b6e45601dd287b000cb145837e8648508393b5ad21fbf9857e8",
          "block": {
            "time": 1725154762
          }
        }
      },
      {
        "id": 817,
        "action": "rollout",
        "bid_amount": null,
        "transaction": {
          "id": 1041,
          "txid": "df17732535dbf2580795415b751e95e2b94633d0ee623f2883458e1587d5936f",
          "block": {
            "time": 1725168709
          }
        }
      },
      {
        "id": 882,
        "action": "bid",
        "bid_amount": 1001,
        "transaction": {
          "id": 1105,
          "txid": "423d159e89c59ef49ac7bb984ab3c8b474743e8b60eecfc6e82cea18cc40faa8",
          "block": {
            "time": 1725541244
          }
        }
      },
      {
        "id": 907,
        "action": "transfer",
        "bid_amount": null,
        "transaction": {
          "id": 1208,
          "txid": "7d4f115ddc587be2e4f9d9add3826645672e0c92244964ee05633c0245af353d",
          "block": {
            "time": 1727736050
          }
        }
      }
    ]
  },
  {
    "id": 298,
    "name": "@candle",
    "nameSha256": "6cd3418a15e15bf3f2ff2b0b4a71f5fd42160332393068bad57af9a0f54f16a3",
    "status": "registered",
    "bid_amount": 1001,
    "claimHeight": 43921,
    "spacesHistoryId": 926,
    "createdAt": "2024-10-02T20:52:29.500Z",
    "updatedAt": "2024-10-07T14:22:00.162Z",
    "rank": "18",
    "history": [
      {
        "id": 714,
        "action": "bid",
        "bid_amount": 1000,
        "transaction": {
          "id": 922,
          "txid": "483f52d1a932aa60db0749a0632d214a66d89a11f27dff8bd8796414d511ec63",
          "block": {
            "time": 1724984665
          }
        }
      },
      {
        "id": 834,
        "action": "rollout",
        "bid_amount": null,
        "transaction": {
          "id": 1044,
          "txid": "39c2aa36c7f805af0f9dd249a1737169be1defe5f0a69da9007f7df9f521526b",
          "block": {
            "time": 1725450337
          }
        }
      },
      {
        "id": 892,
        "action": "bid",
        "bid_amount": 1001,
        "transaction": {
          "id": 1156,
          "txid": "4a5559d0f2701de9a2e7b58cd836ef4fd80a8b2ff774460f1af03a9e62d10594",
          "block": {
            "time": 1725541244
          }
        }
      },
      {
        "id": 926,
        "action": "transfer",
        "bid_amount": null,
        "transaction": {
          "id": 1235,
          "txid": "7dcec31f4a490405afd50b27864ccc0f07bfb8a33b35ee1f502cc2e8217e52a7",
          "block": {
            "time": 1728318106
          }
        }
      }
    ]
  },
  {
    "id": 280,
    "name": "@testnet4artfuldev",
    "nameSha256": "e154bc5dd7e302a9b649ea5ba33e24d599fd4d61e89c0566e8f248d0b43c7d9d",
    "status": "registered",
    "bid_amount": 1001,
    "claimHeight": 49152,
    "spacesHistoryId": 999,
    "createdAt": "2024-10-02T20:52:26.187Z",
    "updatedAt": "2024-10-08T15:51:00.726Z",
    "rank": "19",
    "history": [
      {
        "id": 663,
        "action": "bid",
        "bid_amount": 1000,
        "transaction": {
          "id": 853,
          "txid": "d0718f6c1fdcb9f872b66093178a017af9f7462c6828898fac02ace6f7384cab",
          "block": {
            "time": 1724611265
          }
        }
      },
      {
        "id": 664,
        "action": "reject",
        "bid_amount": null,
        "transaction": {
          "id": 855,
          "txid": "a4ae77f420f7687fdcf5301a3a231d3743f1059f1a327c610cd942dc8a240afe",
          "block": {
            "time": 1724611265
          }
        }
      },
      {
        "id": 665,
        "action": "rollout",
        "bid_amount": null,
        "transaction": {
          "id": 856,
          "txid": "efcf1152559ca55143c0602c153e383dbcddb912011f67a68ccd389e9b808c19",
          "block": {
            "time": 1724640859
          }
        }
      },
      {
        "id": 956,
        "action": "bid",
        "bid_amount": 1001,
        "transaction": {
          "id": 1281,
          "txid": "f92a49e1b9222078278edd39e14e52f9fb89081c1fa23c9d215e39ecc8d5f26a",
          "block": {
            "time": 1728315456
          }
        }
      },
      {
        "id": 999,
        "action": "transfer",
        "bid_amount": null,
        "transaction": {
          "id": 1324,
          "txid": "63acd997d70ae3a4caf4aa341cd86347e4e459a75c1df74a6f9b29755e05f66e",
          "block": {
            "time": 1728409829
          }
        }
      }
    ]
  },
  {
    "id": 289,
    "name": "@audit",
    "nameSha256": "00da80cd1f38a3b2e4960239d981c610d2fe41efdc783ca6fd935202950d98ff",
    "status": "registered",
    "bid_amount": 1000,
    "claimHeight": 43489,
    "spacesHistoryId": 970,
    "createdAt": "2024-10-02T20:52:29.427Z",
    "updatedAt": "2024-10-07T15:39:00.891Z",
    "rank": "20",
    "history": [
      {
        "id": 702,
        "action": "bid",
        "bid_amount": 1000,
        "transaction": {
          "id": 902,
          "txid": "b85c9a77cf58eced2e791e1764cb88b9c4f5394d86a0fd6eb272bbae1a97343a",
          "block": {
            "time": 1724985721
          }
        }
      },
      {
        "id": 776,
        "action": "rollout",
        "bid_amount": null,
        "transaction": {
          "id": 980,
          "txid": "a597bd6da3574cba043c317748ecab5bd64534c5daffa78a5e7f8ac0e7403bd9",
          "block": {
            "time": 1725089125
          }
        }
      },
      {
        "id": 970,
        "action": "transfer",
        "bid_amount": null,
        "transaction": {
          "id": 1295,
          "txid": "275443991faf6b6b9395b4447e5c0b2601252a0c5673bac8f93f36ef5c5428ca",
          "block": {
            "time": 1728322721
          }
        }
      }
    ]
  },
  {
    "id": 352,
    "name": "@corn",
    "nameSha256": "01112f4024ba131ca48127864e141fdcdf32cd8084bd7fccd0063b8efdd269ef",
    "status": "auction",
    "bid_amount": 1000,
    "claimHeight": 50977,
    "spacesHistoryId": 1054,
    "createdAt": "2024-10-07T14:42:00.815Z",
    "updatedAt": "2024-10-10T15:40:00.396Z",
    "rank": "21",
    "history": [
      {
        "id": 943,
        "action": "bid",
        "bid_amount": 1000,
        "transaction": {
          "id": 1258,
          "txid": "2a2b56a046ab2aedc502f64220bf70bcd1ad2ae523266ccc19bd29dcf564c48b",
          "block": {
            "time": 1728319307
          }
        }
      },
      {
        "id": 1054,
        "action": "rollout",
        "bid_amount": null,
        "transaction": {
          "id": 1376,
          "txid": "1e46c34f547fb79f68cc297c6c5974acba4d5ad2f99297053c325f718f456a12",
          "block": {
            "time": 1728578686
          }
        }
      }
    ]
  },
  {
    "id": 382,
    "name": "@411",
    "nameSha256": "01c8b8f412ec44116d81d7bbde558c7db2ace36e221af9295c86360ed6610d4b",
    "status": "auction",
    "bid_amount": 1000,
    "claimHeight": 50977,
    "spacesHistoryId": 1059,
    "createdAt": "2024-10-08T16:32:00.211Z",
    "updatedAt": "2024-10-10T15:40:00.396Z",
    "rank": "22",
    "history": [
      {
        "id": 1022,
        "action": "bid",
        "bid_amount": 1000,
        "transaction": {
          "id": 1359,
          "txid": "6c7a3b4700082f63de58f2d570cd4f33fc50d75b1eb2dd61d5a0a2bb1dfbbfff",
          "block": {
            "time": 1728412271
          }
        }
      },
      {
        "id": 1059,
        "action": "rollout",
        "bid_amount": null,
        "transaction": {
          "id": 1376,
          "txid": "1e46c34f547fb79f68cc297c6c5974acba4d5ad2f99297053c325f718f456a12",
          "block": {
            "time": 1728578686
          }
        }
      }
    ]
  },
  {
    "id": 334,
    "name": "@peer",
    "nameSha256": "02451db9ad3c5d87fde608c85709fb5a3ebf4c4cdc2987f959565ebe97065763",
    "status": "registered",
    "bid_amount": 1000,
    "claimHeight": 43633,
    "spacesHistoryId": 982,
    "createdAt": "2024-10-02T20:52:31.758Z",
    "updatedAt": "2024-10-07T15:39:00.891Z",
    "rank": "23",
    "history": [
      {
        "id": 810,
        "action": "bid",
        "bid_amount": 1000,
        "transaction": {
          "id": 1040,
          "txid": "5322dd320ae3e168648d844c10f9e34f1678307443d4cc1770aafd6a0d3d9367",
          "block": {
            "time": 1725154762
          }
        }
      },
      {
        "id": 815,
        "action": "rollout",
        "bid_amount": null,
        "transaction": {
          "id": 1041,
          "txid": "df17732535dbf2580795415b751e95e2b94633d0ee623f2883458e1587d5936f",
          "block": {
            "time": 1725168709
          }
        }
      },
      {
        "id": 982,
        "action": "transfer",
        "bid_amount": null,
        "transaction": {
          "id": 1307,
          "txid": "00978a074742ac1096c5be751376467798d07dcc120f71f452e5c4fde16c5a75",
          "block": {
            "time": 1728322721
          }
        }
      }
    ]
  },
  {
    "id": 202,
    "name": "@eth",
    "nameSha256": "03e438283304841b59af7f19183cfe6adc11c84a90b50a0c1c628de83cc280bc",
    "status": "registered",
    "bid_amount": 1000,
    "claimHeight": 41905,
    "spacesHistoryId": 764,
    "createdAt": "2024-10-02T20:52:19.419Z",
    "updatedAt": "2024-10-02T20:52:30.684Z",
    "rank": "24",
    "history": [
      {
        "id": 500,
        "action": "bid",
        "bid_amount": 1000,
        "transaction": {
          "id": 678,
          "txid": "5a61002305aa5b7f818d047d17c45eee8f70e5eea5615e4297c5d76d2b8c7f71",
          "block": {
            "time": 1723908277
          }
        }
      },
      {
        "id": 573,
        "action": "rollout",
        "bid_amount": null,
        "transaction": {
          "id": 761,
          "txid": "36a384a9080e8f1f5a301919a064cf2725e2d59f886caa88ab697e1f9446788d",
          "block": {
            "time": 1724162284
          }
        }
      },
      {
        "id": 764,
        "action": "transfer",
        "bid_amount": null,
        "transaction": {
          "id": 977,
          "txid": "bb03a49525b472f9b1811a94410aaebe41eefbe4470990652c8a558af8a4158b",
          "block": {
            "time": 1725071514
          }
        }
      }
    ]
  },
  {
    "id": 389,
    "name": "@land",
    "nameSha256": "056220ec83003131d0fe849abd8e3517cde43a1a64187d18f2daf25a864c1d20",
    "status": "auction",
    "bid_amount": 1000,
    "claimHeight": 50833,
    "spacesHistoryId": 1042,
    "createdAt": "2024-10-08T16:32:00.211Z",
    "updatedAt": "2024-10-10T05:23:00.074Z",
    "rank": "25",
    "history": [
      {
        "id": 1029,
        "action": "bid",
        "bid_amount": 1000,
        "transaction": {
          "id": 1373,
          "txid": "dc716d8b452e08243e4310bf8863729116cd763b225665bae1779172d6cb3f5d",
          "block": {
            "time": 1728412271
          }
        }
      },
      {
        "id": 1042,
        "action": "rollout",
        "bid_amount": null,
        "transaction": {
          "id": 1375,
          "txid": "62fc9c12df7532ea2e099642b0e3803c00ba3abd96ea9e7e21c85e8e5552cabb",
          "block": {
            "time": 1728544952
          }
        }
      }
    ]
  },
  {
    "id": 195,
    "name": "@lucky",
    "nameSha256": "060970f1fcbdd4a80e1fc052fa32721616b2ae39292db81a167a830844a3437a",
    "status": "registered",
    "bid_amount": 1000,
    "claimHeight": 41473,
    "spacesHistoryId": 727,
    "createdAt": "2024-10-02T20:52:19.419Z",
    "updatedAt": "2024-10-02T20:52:29.562Z",
    "rank": "26",
    "history": [
      {
        "id": 493,
        "action": "bid",
        "bid_amount": 1000,
        "transaction": {
          "id": 664,
          "txid": "9836537fc2a6b47d6a8a2e3fdc5d192d9af92a69aa4db00af2da8ae4ed084c5e",
          "block": {
            "time": 1723908277
          }
        }
      },
      {
        "id": 509,
        "action": "rollout",
        "bid_amount": null,
        "transaction": {
          "id": 696,
          "txid": "748b434660b2026ece4275ad25e730a27321656b638c4e3929f65dcff689d1d2",
          "block": {
            "time": 1723926719
          }
        }
      },
      {
        "id": 727,
        "action": "transfer",
        "bid_amount": null,
        "transaction": {
          "id": 940,
          "txid": "7d7ce68e6e7453b3eead82590d37adce886bc294f8cf84268387700d11056803",
          "block": {
            "time": 1724985490
          }
        }
      }
    ]
  },
  {
    "id": 358,
    "name": "@h",
    "nameSha256": "06aa8e416de6e3531bf01fa3b43ba705bac3fb696630c45e81c32d29a26a1974",
    "status": "auction",
    "bid_amount": 1000,
    "claimHeight": 50545,
    "spacesHistoryId": 995,
    "createdAt": "2024-10-07T14:56:00.373Z",
    "updatedAt": "2024-10-08T04:29:00.197Z",
    "rank": "27",
    "history": [
      {
        "id": 949,
        "action": "bid",
        "bid_amount": 1000,
        "transaction": {
          "id": 1271,
          "txid": "161d08f7ea6106529aafda3054bf5b9bcbe63fa61785a89d45b5f935997d0a6c",
          "block": {
            "time": 1728315456
          }
        }
      },
      {
        "id": 995,
        "action": "rollout",
        "bid_amount": null,
        "transaction": {
          "id": 1313,
          "txid": "dfc5fedf742b14271ccda5c80e42d7cf649a00f21ee26e2ce755434f02d2e4c4",
          "block": {
            "time": 1728368724
          }
        }
      }
    ]
  },
  {
    "id": 271,
    "name": "@mission",
    "nameSha256": "073d4ff6a226b7fcf99c1431ac003c2be62b8266df2236ee049176defc0094d5",
    "status": "registered",
    "bid_amount": 1000,
    "claimHeight": 42337,
    "spacesHistoryId": 858,
    "createdAt": "2024-10-02T20:52:23.902Z",
    "updatedAt": "2024-10-02T20:52:34.112Z",
    "rank": "28",
    "history": [
      {
        "id": 634,
        "action": "bid",
        "bid_amount": 1000,
        "transaction": {
          "id": 832,
          "txid": "2d43bc46c49d9639d12d9f23b1e0342855c5c7c4b99d2bd59823b52768b3ea1b",
          "block": {
            "time": 1724336088
          }
        }
      },
      {
        "id": 639,
        "action": "rollout",
        "bid_amount": null,
        "transaction": {
          "id": 837,
          "txid": "13775265c5051319c78d5e8397534cc6a0863912e3103bffa7c8d36e48e11813",
          "block": {
            "time": 1724436541
          }
        }
      },
      {
        "id": 858,
        "action": "transfer",
        "bid_amount": null,
        "transaction": {
          "id": 1065,
          "txid": "017e886b9411fa429335b1926e2a561a877daaf0e40218001d92415828dc962d",
          "block": {
            "time": 1725520217
          }
        }
      }
    ]
  },
  {
    "id": 226,
    "name": "@spaces",
    "nameSha256": "0a1207461acdf0435baed391879fd6de9d358452bc76d2842d4308f3324d6dc0",
    "status": "registered",
    "bid_amount": 1000,
    "claimHeight": 42481,
    "spacesHistoryId": 871,
    "createdAt": "2024-10-02T20:52:20.032Z",
    "updatedAt": "2024-10-02T20:52:34.413Z",
    "rank": "29",
    "history": [
      {
        "id": 534,
        "action": "bid",
        "bid_amount": 1000,
        "transaction": {
          "id": 728,
          "txid": "525e2fa116d3b4d120511ed6b1e2d579c43d6e1ed8a9694d131075205c5c3be0",
          "block": {
            "time": 1723952686
          }
        }
      },
      {
        "id": 649,
        "action": "rollout",
        "bid_amount": null,
        "transaction": {
          "id": 838,
          "txid": "a13b8ed005f9abfc95498f1ad20d89b3c0e8908f3698dde0d334effa39b5a55d",
          "block": {
            "time": 1724530590
          }
        }
      },
      {
        "id": 871,
        "action": "transfer",
        "bid_amount": null,
        "transaction": {
          "id": 1088,
          "txid": "f8d8d24909d693c158b8bf6c590127b96734f69786493351ef3f7fe3e64d4d6b",
          "block": {
            "time": 1725541244
          }
        }
      }
    ]
  },
  {
    "id": 400,
    "name": "@mytest11",
    "nameSha256": "0af22d1d26a45303f656b722a377d499ecc61731c751f4abbd53c8f60719bee2",
    "status": "pre-auction",
    "bid_amount": 1000,
    "claimHeight": null,
    "spacesHistoryId": 1074,
    "createdAt": "2024-10-19T12:42:00.206Z",
    "updatedAt": "2024-10-19T12:42:00.206Z",
    "rank": "30",
    "history": [
      {
        "id": 1074,
        "action": "bid",
        "bid_amount": 1000,
        "transaction": {
          "id": 1407,
          "txid": "bd54c0711b308b10919b070366e86d64115379cdc2863011f55d0daf56565995",
          "block": {
            "time": 1729341684
          }
        }
      }
    ]
  },
  {
    "id": 223,
    "name": "@red",
    "nameSha256": "0bc8c06e25595497e7716d7344cccc27f7f3efd349c123a32cc21afe89fbb7e8",
    "status": "registered",
    "bid_amount": 1000,
    "claimHeight": 41905,
    "spacesHistoryId": 760,
    "createdAt": "2024-10-02T20:52:20.032Z",
    "updatedAt": "2024-10-02T20:52:30.684Z",
    "rank": "31",
    "history": [
      {
        "id": 531,
        "action": "bid",
        "bid_amount": 1000,
        "transaction": {
          "id": 722,
          "txid": "b2f4fecdb0a9e763fd7f182543e5aa86a141aa2311b63eadde534c872f443934",
          "block": {
            "time": 1723952686
          }
        }
      },
      {
        "id": 578,
        "action": "rollout",
        "bid_amount": null,
        "transaction": {
          "id": 761,
          "txid": "36a384a9080e8f1f5a301919a064cf2725e2d59f886caa88ab697e1f9446788d",
          "block": {
            "time": 1724162284
          }
        }
      },
      {
        "id": 760,
        "action": "transfer",
        "bid_amount": null,
        "transaction": {
          "id": 973,
          "txid": "b72bf9055287ce9a11dd997431586c5c7692b862e0cb8926980dad89f189d923",
          "block": {
            "time": 1725071514
          }
        }
      }
    ]
  },
  {
    "id": 344,
    "name": "@message",
    "nameSha256": "0c2aa11f516b7adf6bc9ba336863697cda1f72cc07d4a44bb495d409ed83afce",
    "status": "registered",
    "bid_amount": 1000,
    "claimHeight": 44209,
    "spacesHistoryId": 933,
    "createdAt": "2024-10-02T20:52:34.413Z",
    "updatedAt": "2024-10-07T14:42:00.815Z",
    "rank": "32",
    "history": [
      {
        "id": 878,
        "action": "bid",
        "bid_amount": 1000,
        "transaction": {
          "id": 1095,
          "txid": "3110951cf93bd75892ffa8f4d27700df434782462b98c6baee27786f1f7737ab",
          "block": {
            "time": 1725541244
          }
        }
      },
      {
        "id": 899,
        "action": "rollout",
        "bid_amount": null,
        "transaction": {
          "id": 1163,
          "txid": "bdbf6d1820f81455ffe142efeb5568b4f6ce9b82a769bbe32a053832e8bfdc10",
          "block": {
            "time": 1725583181
          }
        }
      },
      {
        "id": 933,
        "action": "transfer",
        "bid_amount": null,
        "transaction": {
          "id": 1242,
          "txid": "8406442bcaf7776bbff5388280326497341fcb098dd8e43f2bf11101756b3c1e",
          "block": {
            "time": 1728319307
          }
        }
      }
    ]
  },
  {
    "id": 360,
    "name": "@n",
    "nameSha256": "0c83ed501979634864e5d7d0d35eef7cbae351ffe52c844eae8501e3db9c9ce3",
    "status": "auction",
    "bid_amount": 1000,
    "claimHeight": 50977,
    "spacesHistoryId": 1058,
    "createdAt": "2024-10-07T14:56:00.373Z",
    "updatedAt": "2024-10-10T15:40:00.396Z",
    "rank": "33",
    "history": [
      {
        "id": 951,
        "action": "bid",
        "bid_amount": 1000,
        "transaction": {
          "id": 1275,
          "txid": "7fe650f748d27d4deb6733c5842b7cffce3c4ab08f0c80875609711b83190a11",
          "block": {
            "time": 1728315456
          }
        }
      },
      {
        "id": 1058,
        "action": "rollout",
        "bid_amount": null,
        "transaction": {
          "id": 1376,
          "txid": "1e46c34f547fb79f68cc297c6c5974acba4d5ad2f99297053c325f718f456a12",
          "block": {
            "time": 1728578686
          }
        }
      }
    ]
  },
  {
    "id": 293,
    "name": "@boot",
    "nameSha256": "0d443a82e17c71eb1bbc2a14318e803a1a039ec036b87c2e528ba9ef04a5511a",
    "status": "registered",
    "bid_amount": 1000,
    "claimHeight": 43345,
    "spacesHistoryId": 960,
    "createdAt": "2024-10-02T20:52:29.479Z",
    "updatedAt": "2024-10-07T14:56:00.373Z",
    "rank": "34",
    "history": [
      {
        "id": 709,
        "action": "bid",
        "bid_amount": 1000,
        "transaction": {
          "id": 912,
          "txid": "32b0cd7ccee62690449e3490245d967e491f58069c1a0487ec39a4f82833baee",
          "block": {
            "time": 1724986924
          }
        }
      },
      {
        "id": 748,
        "action": "rollout",
        "bid_amount": null,
        "transaction": {
          "id": 966,
          "txid": "4e0e6fa469456a7030468269b8fd988e32c8f5cc888ce00120fa36a92d787cd0",
          "block": {
            "time": 1725027352
          }
        }
      },
      {
        "id": 960,
        "action": "transfer",
        "bid_amount": null,
        "transaction": {
          "id": 1285,
          "txid": "561cb28b482b48ea886deb01104916d59387d77d20dc33e14a762bfda915313e",
          "block": {
            "time": 1728315456
          }
        }
      }
    ]
  },
  {
    "id": 285,
    "name": "@hour",
    "nameSha256": "0f7571e7ffcdf59b62022793ccbb74c6d0c4e07a4af4f21d827ea15f5c5d7383",
    "status": "registered",
    "bid_amount": 1000,
    "claimHeight": 42769,
    "spacesHistoryId": 957,
    "createdAt": "2024-10-02T20:52:26.446Z",
    "updatedAt": "2024-10-07T14:56:00.373Z",
    "rank": "35",
    "history": [
      {
        "id": 676,
        "action": "bid",
        "bid_amount": 1000,
        "transaction": {
          "id": 867,
          "txid": "44d98aac87971efcfddd6a6bdf5c70e04f332e2253a5f847521ac8a9d21631f1",
          "block": {
            "time": 1724646033
          }
        }
      },
      {
        "id": 678,
        "action": "rollout",
        "bid_amount": null,
        "transaction": {
          "id": 870,
          "txid": "b9fe9b1a38d89a648ef6296bf54ae8514dcbbaaf4c38ac0b3dc0a3698cf45690",
          "block": {
            "time": 1724752162
          }
        }
      },
      {
        "id": 957,
        "action": "transfer",
        "bid_amount": null,
        "transaction": {
          "id": 1282,
          "txid": "15a042c26bb44324548b9777d5b4aad1d3c7c7105ecee16347b3610410326bb3",
          "block": {
            "time": 1728315456
          }
        }
      }
    ]
  },
  {
    "id": 396,
    "name": "@mytest7",
    "nameSha256": "13857e95543d609048012b05a00186de484f9e151d6f7cbcb23c53e1989e994c",
    "status": "pre-auction",
    "bid_amount": 1000,
    "claimHeight": null,
    "spacesHistoryId": 1070,
    "createdAt": "2024-10-19T12:42:00.206Z",
    "updatedAt": "2024-10-19T12:42:00.206Z",
    "rank": "36",
    "history": [
      {
        "id": 1070,
        "action": "bid",
        "bid_amount": 1000,
        "transaction": {
          "id": 1399,
          "txid": "c362bd0fefa1d86a7688f62ac5d6a50cdfbf62a3eeac302ab4471d31e59b0720",
          "block": {
            "time": 1729341684
          }
        }
      }
    ]
  },
  {
    "id": 365,
    "name": "@do",
    "nameSha256": "1397b8c9da22779241b223515b8cf790cf72baef95d18359e041af21710e3eea",
    "status": "auction",
    "bid_amount": 1000,
    "claimHeight": 50689,
    "spacesHistoryId": 1034,
    "createdAt": "2024-10-08T15:51:00.726Z",
    "updatedAt": "2024-10-09T01:13:00.537Z",
    "rank": "37",
    "history": [
      {
        "id": 1005,
        "action": "bid",
        "bid_amount": 1000,
        "transaction": {
          "id": 1332,
          "txid": "416f6b3f261e352e1517a0d5d39ea11c3ef9f290d44952c71c20a427b4465572",
          "block": {
            "time": 1728409829
          }
        }
      },
      {
        "id": 1034,
        "action": "rollout",
        "bid_amount": null,
        "transaction": {
          "id": 1374,
          "txid": "01797a10e75cc91a87eccf99e01a59f203c9a6f720b9d30122590b355bd5da10",
          "block": {
            "time": 1728441324
          }
        }
      }
    ]
  },
  {
    "id": 309,
    "name": "@doge",
    "nameSha256": "142eef94dd3898bb00749f8c405042ff33440659954fb8f995b09f6cfbf6ade7",
    "status": "registered",
    "bid_amount": 1000,
    "claimHeight": 43345,
    "spacesHistoryId": 962,
    "createdAt": "2024-10-02T20:52:29.635Z",
    "updatedAt": "2024-10-07T14:59:00.459Z",
    "rank": "38",
    "history": [
      {
        "id": 744,
        "action": "bid",
        "bid_amount": 1000,
        "transaction": {
          "id": 965,
          "txid": "fa978b37a009f6cc1518d4bde04035ff45eed7f04c4aa5453647d7309b8ff586",
          "block": {
            "time": 1724987894
          }
        }
      },
      {
        "id": 750,
        "action": "rollout",
        "bid_amount": null,
        "transaction": {
          "id": 966,
          "txid": "4e0e6fa469456a7030468269b8fd988e32c8f5cc888ce00120fa36a92d787cd0",
          "block": {
            "time": 1725027352
          }
        }
      },
      {
        "id": 962,
        "action": "transfer",
        "bid_amount": null,
        "transaction": {
          "id": 1287,
          "txid": "46127da1896fa62fc5a688de847ab6bca71104b0920ca7dbd2fe58c78580b4b1",
          "block": {
            "time": 1728320319
          }
        }
      }
    ]
  },
  {
    "id": 267,
    "name": "@code",
    "nameSha256": "15d020120d7a05771f6919182a865e1564633379a597a06b4e9ff9db349de4aa",
    "status": "registered",
    "bid_amount": 1000,
    "claimHeight": 42481,
    "spacesHistoryId": 864,
    "createdAt": "2024-10-02T20:52:23.845Z",
    "updatedAt": "2024-10-02T20:52:34.413Z",
    "rank": "39",
    "history": [
      {
        "id": 630,
        "action": "bid",
        "bid_amount": 1000,
        "transaction": {
          "id": 826,
          "txid": "71d74cc9202502a5541e8ef2cfec71f5f188359236b7cab602b5300945e2cf06",
          "block": {
            "time": 1724333680
          }
        }
      },
      {
        "id": 653,
        "action": "rollout",
        "bid_amount": null,
        "transaction": {
          "id": 838,
          "txid": "a13b8ed005f9abfc95498f1ad20d89b3c0e8908f3698dde0d334effa39b5a55d",
          "block": {
            "time": 1724530590
          }
        }
      },
      {
        "id": 864,
        "action": "transfer",
        "bid_amount": null,
        "transaction": {
          "id": 1081,
          "txid": "e0825c3663bcff86c99fd215237962a4eefa63cd42c64384831f44d18b846567",
          "block": {
            "time": 1725541244
          }
        }
      }
    ]
  },
  {
    "id": 220,
    "name": "@star",
    "nameSha256": "160bc9b75079a24997241247d58add5767fa69baf60fed285e3eaca9153536aa",
    "status": "registered",
    "bid_amount": 1000,
    "claimHeight": 41761,
    "spacesHistoryId": 704,
    "createdAt": "2024-10-02T20:52:19.805Z",
    "updatedAt": "2024-10-02T20:52:29.427Z",
    "rank": "40",
    "history": [
      {
        "id": 528,
        "action": "bid",
        "bid_amount": 1000,
        "transaction": {
          "id": 716,
          "txid": "03c083ef8f268368b9a6e6195a46c0bfb210ddc53d9136abf9ee9a7612353f01",
          "block": {
            "time": 1723932235
          }
        }
      },
      {
        "id": 562,
        "action": "rollout",
        "bid_amount": null,
        "transaction": {
          "id": 750,
          "txid": "ba0c795e2fad7da5562a80ebfb4909d27eb2c7e8809f9c79becc339272845979",
          "block": {
            "time": 1724077177
          }
        }
      },
      {
        "id": 704,
        "action": "transfer",
        "bid_amount": null,
        "transaction": {
          "id": 905,
          "txid": "d582cf88ec0248dd0d1ba1dd170b7ba4378089f680fe318faac625f10225e21f",
          "block": {
            "time": 1724985721
          }
        }
      }
    ]
  },
  {
    "id": 238,
    "name": "@gold",
    "nameSha256": "184d30df394ffffea513ea19b2827ce082ca759639e9b828905943554ce0a970",
    "status": "registered",
    "bid_amount": 1000,
    "claimHeight": 42193,
    "spacesHistoryId": 845,
    "createdAt": "2024-10-02T20:52:22.136Z",
    "updatedAt": "2024-10-02T20:52:34.112Z",
    "rank": "41",
    "history": [
      {
        "id": 580,
        "action": "bid",
        "bid_amount": 1000,
        "transaction": {
          "id": 763,
          "txid": "8f8c7f6c362e476454de326fd5ad3e8456515e37556d1b3d7390a6ef5402db45",
          "block": {
            "time": 1724163404
          }
        }
      },
      {
        "id": 624,
        "action": "rollout",
        "bid_amount": null,
        "transaction": {
          "id": 816,
          "txid": "7af1e824358c2644ef73e4e1ebde8d2fe27ed5ee4af29dc068bc723080ccbb1d",
          "block": {
            "time": 1724329893
          }
        }
      },
      {
        "id": 845,
        "action": "transfer",
        "bid_amount": null,
        "transaction": {
          "id": 1052,
          "txid": "29459d696dd57599ae1144e53ce5d38d18c975b75084314a495bb21118f23700",
          "block": {
            "time": 1725520217
          }
        }
      }
    ]
  },
  {
    "id": 225,
    "name": "@purple",
    "nameSha256": "193ce0f9e4609835af4994a0f65c4637ac14623c24726aabc47ab8816eaef208",
    "status": "registered",
    "bid_amount": 1000,
    "claimHeight": 41617,
    "spacesHistoryId": 697,
    "createdAt": "2024-10-02T20:52:20.032Z",
    "updatedAt": "2024-10-02T20:52:29.398Z",
    "rank": "42",
    "history": [
      {
        "id": 533,
        "action": "bid",
        "bid_amount": 1000,
        "transaction": {
          "id": 726,
          "txid": "aadb3646ddf5e986e9b156c5fbd356565d59a74ce677ffeb109421d00c252d3c",
          "block": {
            "time": 1723952686
          }
        }
      },
      {
        "id": 536,
        "action": "rollout",
        "bid_amount": null,
        "transaction": {
          "id": 729,
          "txid": "ed5fbad05e3c895cb4e183b1df94ec6928bad102c4ad689f7cc339bac8def4de",
          "block": {
            "time": 1723994427
          }
        }
      },
      {
        "id": 697,
        "action": "transfer",
        "bid_amount": null,
        "transaction": {
          "id": 894,
          "txid": "446b7d4c200ed4e5551baa76620c6a1db9f7a31da83e5137d5e675fef54069d7",
          "block": {
            "time": 1724984520
          }
        }
      }
    ]
  },
  {
    "id": 240,
    "name": "@wall",
    "nameSha256": "19a8c2afe0028deb4cbf263e7e5512323489531e32eb1b7eaaecc4ca7c6d327e",
    "status": "registered",
    "bid_amount": 1000,
    "claimHeight": 42049,
    "spacesHistoryId": 782,
    "createdAt": "2024-10-02T20:52:22.136Z",
    "updatedAt": "2024-10-02T20:52:31.319Z",
    "rank": "43",
    "history": [
      {
        "id": 582,
        "action": "bid",
        "bid_amount": 1000,
        "transaction": {
          "id": 767,
          "txid": "c827c6573b109e4c16d94330e1f2f4256e56f5180835796de25869c8de2ae465",
          "block": {
            "time": 1724163404
          }
        }
      },
      {
        "id": 607,
        "action": "rollout",
        "bid_amount": null,
        "transaction": {
          "id": 811,
          "txid": "b38f1a9aaa4ce4be5112ca50fe181b7880b1f8474c052a8662881295c38d0be3",
          "block": {
            "time": 1724255932
          }
        }
      },
      {
        "id": 782,
        "action": "transfer",
        "bid_amount": null,
        "transaction": {
          "id": 986,
          "txid": "57113424564d682a869452d97b2dbecd96d7c1e1ee2c9e69583709a44eb679aa",
          "block": {
            "time": 1725118410
          }
        }
      }
    ]
  },
  {
    "id": 384,
    "name": "@joke",
    "nameSha256": "19ddf9e94c11568cc6586157f6fdf405dbbfb47ae7c5db163a0fe61de72c38ef",
    "status": "auction",
    "bid_amount": 1000,
    "claimHeight": 50833,
    "spacesHistoryId": 1049,
    "createdAt": "2024-10-08T16:32:00.211Z",
    "updatedAt": "2024-10-10T05:23:00.074Z",
    "rank": "44",
    "history": [
      {
        "id": 1024,
        "action": "bid",
        "bid_amount": 1000,
        "transaction": {
          "id": 1363,
          "txid": "8b4ba78331dfec8f8851830c27462e6f007ee1c785cb03c2857a755d4ead6a3f",
          "block": {
            "time": 1728412271
          }
        }
      },
      {
        "id": 1049,
        "action": "rollout",
        "bid_amount": null,
        "transaction": {
          "id": 1375,
          "txid": "62fc9c12df7532ea2e099642b0e3803c00ba3abd96ea9e7e21c85e8e5552cabb",
          "block": {
            "time": 1728544952
          }
        }
      }
    ]
  },
  {
    "id": 279,
    "name": "@tag",
    "nameSha256": "1c55ff2411da00c7fc1eaced5b57ed7168afbc7c7a41d143ce28a4dcfb6c8325",
    "status": "registered",
    "bid_amount": 1000,
    "claimHeight": 42625,
    "spacesHistoryId": 887,
    "createdAt": "2024-10-02T20:52:26.048Z",
    "updatedAt": "2024-10-02T20:52:34.413Z",
    "rank": "45",
    "history": [
      {
        "id": 662,
        "action": "bid",
        "bid_amount": 1000,
        "transaction": {
          "id": 851,
          "txid": "eabdac7d7bb98f21c964e388259e4e226bfbce9c1ab923d948eeb15df7af13bf",
          "block": {
            "time": 1724598174
          }
        }
      },
      {
        "id": 671,
        "action": "rollout",
        "bid_amount": null,
        "transaction": {
          "id": 856,
          "txid": "efcf1152559ca55143c0602c153e383dbcddb912011f67a68ccd389e9b808c19",
          "block": {
            "time": 1724640859
          }
        }
      },
      {
        "id": 887,
        "action": "transfer",
        "bid_amount": null,
        "transaction": {
          "id": 1149,
          "txid": "343bcc920f0c5fc30c8769667be8855a38e3c09e0856c4198a5814768ca8a7ac",
          "block": {
            "time": 1725541244
          }
        }
      }
    ]
  },
  {
    "id": 196,
    "name": "@wow",
    "nameSha256": "1e0100ef25b9efbb7b32306e88ff959a3effd03c66534b096904a444e7022e30",
    "status": "registered",
    "bid_amount": 1000,
    "claimHeight": 41905,
    "spacesHistoryId": 758,
    "createdAt": "2024-10-02T20:52:19.419Z",
    "updatedAt": "2024-10-02T20:52:30.684Z",
    "rank": "46",
    "history": [
      {
        "id": 494,
        "action": "bid",
        "bid_amount": 1000,
        "transaction": {
          "id": 666,
          "txid": "e0db411dae3b2841f3c0dabe9c5c99fcb72fed3f76508465e9ba8c3997d327da",
          "block": {
            "time": 1723908277
          }
        }
      },
      {
        "id": 577,
        "action": "rollout",
        "bid_amount": null,
        "transaction": {
          "id": 761,
          "txid": "36a384a9080e8f1f5a301919a064cf2725e2d59f886caa88ab697e1f9446788d",
          "block": {
            "time": 1724162284
          }
        }
      },
      {
        "id": 758,
        "action": "transfer",
        "bid_amount": null,
        "transaction": {
          "id": 971,
          "txid": "ec04b75b722eaf954f66d02da60c180e3f3b38a1a523cd8ed4f93979538aff97",
          "block": {
            "time": 1725071514
          }
        }
      }
    ]
  },
  {
    "id": 339,
    "name": "@vpn",
    "nameSha256": "1ed9793979ec88768c95f2c481d214c3f3ca81aa10794f3db772f3dd8f63f40b",
    "status": "registered",
    "bid_amount": 1000,
    "claimHeight": 44209,
    "spacesHistoryId": 932,
    "createdAt": "2024-10-02T20:52:34.413Z",
    "updatedAt": "2024-10-07T14:42:00.815Z",
    "rank": "47",
    "history": [
      {
        "id": 873,
        "action": "bid",
        "bid_amount": 1000,
        "transaction": {
          "id": 1090,
          "txid": "1b61e7e862da62fb3903985d5fa2e22901a0cbf5ca23840fcc430a55df8c2142",
          "block": {
            "time": 1725541244
          }
        }
      },
      {
        "id": 898,
        "action": "rollout",
        "bid_amount": null,
        "transaction": {
          "id": 1163,
          "txid": "bdbf6d1820f81455ffe142efeb5568b4f6ce9b82a769bbe32a053832e8bfdc10",
          "block": {
            "time": 1725583181
          }
        }
      },
      {
        "id": 932,
        "action": "transfer",
        "bid_amount": null,
        "transaction": {
          "id": 1241,
          "txid": "0126041ca45466d897c174b400dcfcc1c71bfe9ce10746e2934bf57e7995add5",
          "block": {
            "time": 1728319307
          }
        }
      }
    ]
  },
  {
    "id": 348,
    "name": "@hotdog",
    "nameSha256": "1fba6d875676b52ee37a18620968410499edb32020cb6af88ed389630434b950",
    "status": "auction",
    "bid_amount": 1000,
    "claimHeight": 50545,
    "spacesHistoryId": 997,
    "createdAt": "2024-10-07T14:42:00.815Z",
    "updatedAt": "2024-10-08T04:29:00.197Z",
    "rank": "48",
    "history": [
      {
        "id": 939,
        "action": "bid",
        "bid_amount": 1000,
        "transaction": {
          "id": 1250,
          "txid": "6a3d0dbcbd5dc5b73fdde1df9c16e3ef0bc28499e793bcef06d7b5e4a53c0566",
          "block": {
            "time": 1728319307
          }
        }
      },
      {
        "id": 997,
        "action": "rollout",
        "bid_amount": null,
        "transaction": {
          "id": 1313,
          "txid": "dfc5fedf742b14271ccda5c80e42d7cf649a00f21ee26e2ce755434f02d2e4c4",
          "block": {
            "time": 1728368724
          }
        }
      }
    ]
  },
  {
    "id": 258,
    "name": "@art",
    "nameSha256": "20edff19f2bfbeb49253a665cb797e85407cad47e129cc683648ca1ece1f1f2b",
    "status": "registered",
    "bid_amount": 1000,
    "claimHeight": 42049,
    "spacesHistoryId": 781,
    "createdAt": "2024-10-02T20:52:22.915Z",
    "updatedAt": "2024-10-02T20:52:31.319Z",
    "rank": "49",
    "history": [
      {
        "id": 601,
        "action": "bid",
        "bid_amount": 1000,
        "transaction": {
          "id": 804,
          "txid": "1f24ad90c1fbcc25a802e7e87f9764e0594dd666eadbf6961a80d6900576688d",
          "block": {
            "time": 1724251887
          }
        }
      },
      {
        "id": 605,
        "action": "rollout",
        "bid_amount": null,
        "transaction": {
          "id": 811,
          "txid": "b38f1a9aaa4ce4be5112ca50fe181b7880b1f8474c052a8662881295c38d0be3",
          "block": {
            "time": 1724255932
          }
        }
      },
      {
        "id": 781,
        "action": "transfer",
        "bid_amount": null,
        "transaction": {
          "id": 985,
          "txid": "e59f52c9bef9263d120fef54db05838dd412ea3b35dbd7bb76fae46adddddf1b",
          "block": {
            "time": 1725118410
          }
        }
      }
    ]
  },
  {
    "id": 248,
    "name": "@hero",
    "nameSha256": "212e6cb31f06c2072732747f641c9a16ecf27be7505260ad018165cd1fe87402",
    "status": "registered",
    "bid_amount": 1000,
    "claimHeight": 42337,
    "spacesHistoryId": 856,
    "createdAt": "2024-10-02T20:52:22.852Z",
    "updatedAt": "2024-10-02T20:52:34.112Z",
    "rank": "50",
    "history": [
      {
        "id": 591,
        "action": "bid",
        "bid_amount": 1000,
        "transaction": {
          "id": 784,
          "txid": "57108e361045e2e99a79fa287ee05f0319e36c1f234123e4425102a1120e115b",
          "block": {
            "time": 1724249541
          }
        }
      },
      {
        "id": 646,
        "action": "rollout",
        "bid_amount": null,
        "transaction": {
          "id": 837,
          "txid": "13775265c5051319c78d5e8397534cc6a0863912e3103bffa7c8d36e48e11813",
          "block": {
            "time": 1724436541
          }
        }
      },
      {
        "id": 856,
        "action": "transfer",
        "bid_amount": null,
        "transaction": {
          "id": 1063,
          "txid": "889f8860595a1c40308194d3283074aee933f929b1214d8af0db9383460fd556",
          "block": {
            "time": 1725520217
          }
        }
      }
    ]
  },
  {
    "id": 203,
    "name": "@open",
    "nameSha256": "21fa09a030d2b92748561527c1eabab46abcfb7a905b4ef1a844aab22ca6d300",
    "status": "registered",
    "bid_amount": 1000,
    "claimHeight": 41905,
    "spacesHistoryId": 757,
    "createdAt": "2024-10-02T20:52:19.508Z",
    "updatedAt": "2024-10-02T20:52:30.684Z",
    "rank": "51",
    "history": [
      {
        "id": 501,
        "action": "bid",
        "bid_amount": 1000,
        "transaction": {
          "id": 681,
          "txid": "d8f8eb36031f6c05c0cad8ea64a6952570c0d6b82f8af4ce8ee2c7d3941cef1a",
          "block": {
            "time": 1723909697
          }
        }
      },
      {
        "id": 574,
        "action": "rollout",
        "bid_amount": null,
        "transaction": {
          "id": 761,
          "txid": "36a384a9080e8f1f5a301919a064cf2725e2d59f886caa88ab697e1f9446788d",
          "block": {
            "time": 1724162284
          }
        }
      },
      {
        "id": 757,
        "action": "transfer",
        "bid_amount": null,
        "transaction": {
          "id": 970,
          "txid": "89f0ae6c1551cca826029e030015ef8b4f591741c43bf78b378a26e1d27e4076",
          "block": {
            "time": 1725071514
          }
        }
      }
    ]
  },
  {
    "id": 239,
    "name": "@run",
    "nameSha256": "2304de6a25faf1eca449f0eb1ec0f0f357c276f5f86cd365900ffcdbbc6e436f",
    "status": "registered",
    "bid_amount": 1000,
    "claimHeight": 42337,
    "spacesHistoryId": 855,
    "createdAt": "2024-10-02T20:52:22.136Z",
    "updatedAt": "2024-10-02T20:52:34.112Z",
    "rank": "52",
    "history": [
      {
        "id": 581,
        "action": "bid",
        "bid_amount": 1000,
        "transaction": {
          "id": 765,
          "txid": "d6931fe94dd0ce628e16cc14856691b8ec45e8e878ef1488129c156c48c2569c",
          "block": {
            "time": 1724163404
          }
        }
      },
      {
        "id": 645,
        "action": "rollout",
        "bid_amount": null,
        "transaction": {
          "id": 837,
          "txid": "13775265c5051319c78d5e8397534cc6a0863912e3103bffa7c8d36e48e11813",
          "block": {
            "time": 1724436541
          }
        }
      },
      {
        "id": 855,
        "action": "transfer",
        "bid_amount": null,
        "transaction": {
          "id": 1062,
          "txid": "249c88fbfded2b2afedcc42c476dd8a5a0b8f899e00932e49a0aa4c878b8e212",
          "block": {
            "time": 1725520217
          }
        }
      }
    ]
  },
  {
    "id": 351,
    "name": "@donut",
    "nameSha256": "256328c20bbeaf3ad88480dec27b115461fb0888a01cd3a14eac4ace15e03cae",
    "status": "auction",
    "bid_amount": 1000,
    "claimHeight": 51121,
    "spacesHistoryId": 1060,
    "createdAt": "2024-10-07T14:42:00.815Z",
    "updatedAt": "2024-10-11T01:13:00.785Z",
    "rank": "53",
    "history": [
      {
        "id": 942,
        "action": "bid",
        "bid_amount": 1000,
        "transaction": {
          "id": 1256,
          "txid": "13ca8754bee2c44a9c6e461f60f27c611399bb54c2e5923f46878c7e723cd3fc",
          "block": {
            "time": 1728319307
          }
        }
      },
      {
        "id": 1060,
        "action": "rollout",
        "bid_amount": null,
        "transaction": {
          "id": 1377,
          "txid": "44f0b479f7c1e1b4f6120e26b958b2e0a29a336ace75c6f06f763f3ab9627361",
          "block": {
            "time": 1728613773
          }
        }
      }
    ]
  },
  {
    "id": 250,
    "name": "@gaming",
    "nameSha256": "259326bfb46f734c50b173e4f1bcc322304b8f5173560e34fcfc157f6967019c",
    "status": "registered",
    "bid_amount": 1000,
    "claimHeight": 42049,
    "spacesHistoryId": 778,
    "createdAt": "2024-10-02T20:52:22.852Z",
    "updatedAt": "2024-10-02T20:52:31.319Z",
    "rank": "54",
    "history": [
      {
        "id": 593,
        "action": "bid",
        "bid_amount": 1000,
        "transaction": {
          "id": 788,
          "txid": "e64c7b708a1b3ec0320e9861507b36a6ea8503f7f13b5d9fc90c8be4425e9587",
          "block": {
            "time": 1724249541
          }
        }
      },
      {
        "id": 612,
        "action": "rollout",
        "bid_amount": null,
        "transaction": {
          "id": 811,
          "txid": "b38f1a9aaa4ce4be5112ca50fe181b7880b1f8474c052a8662881295c38d0be3",
          "block": {
            "time": 1724255932
          }
        }
      },
      {
        "id": 778,
        "action": "transfer",
        "bid_amount": null,
        "transaction": {
          "id": 982,
          "txid": "86b46251834307d323d2f1ab8c9ee5c6a4b3eed50066f968adb3e0e96d61dde7",
          "block": {
            "time": 1725118410
          }
        }
      }
    ]
  },
  {
    "id": 307,
    "name": "@cost",
    "nameSha256": "2678ffbb0b4d7ff66b6f8fc875c5941ed22c6c63f5353e7a6717b3ce4e0d254f",
    "status": "registered",
    "bid_amount": 1000,
    "claimHeight": 43921,
    "spacesHistoryId": 923,
    "createdAt": "2024-10-02T20:52:29.635Z",
    "updatedAt": "2024-10-07T14:22:00.127Z",
    "rank": "55",
    "history": [
      {
        "id": 742,
        "action": "bid",
        "bid_amount": 1000,
        "transaction": {
          "id": 961,
          "txid": "013c82cd644571afdd55a7e899e0c448c82df29924c18cc82cfd6b574cabed92",
          "block": {
            "time": 1724987894
          }
        }
      },
      {
        "id": 838,
        "action": "rollout",
        "bid_amount": null,
        "transaction": {
          "id": 1044,
          "txid": "39c2aa36c7f805af0f9dd249a1737169be1defe5f0a69da9007f7df9f521526b",
          "block": {
            "time": 1725450337
          }
        }
      },
      {
        "id": 923,
        "action": "transfer",
        "bid_amount": null,
        "transaction": {
          "id": 1232,
          "txid": "cc58b4cf75802075eb78d017449486164fa63cbc4315080051e85288bf64cd99",
          "block": {
            "time": 1728314204
          }
        }
      }
    ]
  },
  {
    "id": 315,
    "name": "@draft",
    "nameSha256": "26b808f337e850f592c627b7ddd00a5c982b0580e980853fbbe3184c855bc109",
    "status": "registered",
    "bid_amount": 1000,
    "claimHeight": 43777,
    "spacesHistoryId": 986,
    "createdAt": "2024-10-02T20:52:31.388Z",
    "updatedAt": "2024-10-07T15:39:00.891Z",
    "rank": "56",
    "history": [
      {
        "id": 791,
        "action": "bid",
        "bid_amount": 1000,
        "transaction": {
          "id": 1001,
          "txid": "a40ba0ba4c604ec318caf5e533346d6576595a47f222c4e24a6ac556fc631c05",
          "block": {
            "time": 1725121917
          }
        }
      },
      {
        "id": 828,
        "action": "rollout",
        "bid_amount": null,
        "transaction": {
          "id": 1043,
          "txid": "6d3e3777b3aaef22cbe5374c1dd946f59fff9821e182ee09bec3ae5a3a855205",
          "block": {
            "time": 1725381834
          }
        }
      },
      {
        "id": 986,
        "action": "transfer",
        "bid_amount": null,
        "transaction": {
          "id": 1311,
          "txid": "eff3786583fe92ed700607df4ccb6bc3d66f02fac933eb4441b244b01b93441c",
          "block": {
            "time": 1728322721
          }
        }
      }
    ]
  },
  {
    "id": 317,
    "name": "@drill",
    "nameSha256": "27b16e59101b8a911e51d6622a0d15712ca21ebb1926f20c1b69d137267fc663",
    "status": "registered",
    "bid_amount": 1000,
    "claimHeight": 43921,
    "spacesHistoryId": 922,
    "createdAt": "2024-10-02T20:52:31.388Z",
    "updatedAt": "2024-10-07T14:22:00.127Z",
    "rank": "57",
    "history": [
      {
        "id": 793,
        "action": "bid",
        "bid_amount": 1000,
        "transaction": {
          "id": 1005,
          "txid": "75af9d6189099bbaf8127f74c56de6b1dbc74822465842cdb93fa9eb2edf904b",
          "block": {
            "time": 1725121917
          }
        }
      },
      {
        "id": 836,
        "action": "rollout",
        "bid_amount": null,
        "transaction": {
          "id": 1044,
          "txid": "39c2aa36c7f805af0f9dd249a1737169be1defe5f0a69da9007f7df9f521526b",
          "block": {
            "time": 1725450337
          }
        }
      },
      {
        "id": 922,
        "action": "transfer",
        "bid_amount": null,
        "transaction": {
          "id": 1231,
          "txid": "b1d829fd5f22ec5281b3213913a39814c6cc2f9d7fbe5a5a6a24a4a142add4bd",
          "block": {
            "time": 1728314204
          }
        }
      }
    ]
  },
  {
    "id": 208,
    "name": "@good",
    "nameSha256": "2814de3e36e37d414f3f1632c8c4e43f88c3508e5d36ffcac96b87911ffcffa1",
    "status": "registered",
    "bid_amount": 1000,
    "claimHeight": 41473,
    "spacesHistoryId": 725,
    "createdAt": "2024-10-02T20:52:19.563Z",
    "updatedAt": "2024-10-02T20:52:29.562Z",
    "rank": "58",
    "history": [
      {
        "id": 506,
        "action": "bid",
        "bid_amount": 1000,
        "transaction": {
          "id": 693,
          "txid": "9d57b4b420de139cbba55c14fc488a49e55cd3c855bc65db530b768dde2996b9",
          "block": {
            "time": 1723915939
          }
        }
      },
      {
        "id": 518,
        "action": "rollout",
        "bid_amount": null,
        "transaction": {
          "id": 696,
          "txid": "748b434660b2026ece4275ad25e730a27321656b638c4e3929f65dcff689d1d2",
          "block": {
            "time": 1723926719
          }
        }
      },
      {
        "id": 725,
        "action": "transfer",
        "bid_amount": null,
        "transaction": {
          "id": 938,
          "txid": "c732e4f7fc6a414f604b326f284263edbea171a456f54a58e267cf7961893cb9",
          "block": {
            "time": 1724985490
          }
        }
      }
    ]
  },
  {
    "id": 260,
    "name": "@teach",
    "nameSha256": "28a83abdb3e21ee862ef2fdd17099b9897127901f20126fda0762ea60076cda4",
    "status": "registered",
    "bid_amount": 1000,
    "claimHeight": 42049,
    "spacesHistoryId": 780,
    "createdAt": "2024-10-02T20:52:22.915Z",
    "updatedAt": "2024-10-02T20:52:31.319Z",
    "rank": "59",
    "history": [
      {
        "id": 603,
        "action": "bid",
        "bid_amount": 1000,
        "transaction": {
          "id": 808,
          "txid": "182ccbdd9d989cef47b7ebaf7edcb24e5bfcc598f69709852494b1d1c9f2c80b",
          "block": {
            "time": 1724251887
          }
        }
      },
      {
        "id": 613,
        "action": "rollout",
        "bid_amount": null,
        "transaction": {
          "id": 811,
          "txid": "b38f1a9aaa4ce4be5112ca50fe181b7880b1f8474c052a8662881295c38d0be3",
          "block": {
            "time": 1724255932
          }
        }
      },
      {
        "id": 780,
        "action": "transfer",
        "bid_amount": null,
        "transaction": {
          "id": 984,
          "txid": "0390b7ffe2dc09b698c8390b03e1653e4fee2212796e43b21c9904bbf2357f3d",
          "block": {
            "time": 1725118410
          }
        }
      }
    ]
  },
  {
    "id": 376,
    "name": "@meatball",
    "nameSha256": "28c845741fdcf15510200cb106052bec7c12e88efd4bc1706d6358adf7a0377d",
    "status": "auction",
    "bid_amount": 1000,
    "claimHeight": 50977,
    "spacesHistoryId": 1055,
    "createdAt": "2024-10-08T15:55:00.897Z",
    "updatedAt": "2024-10-10T15:40:00.396Z",
    "rank": "60",
    "history": [
      {
        "id": 1016,
        "action": "bid",
        "bid_amount": 1000,
        "transaction": {
          "id": 1347,
          "txid": "c1cc25c46e5049ddf3565fafb357b958877389ead85ccf14d69031005e63fcca",
          "block": {
            "time": 1728403843
          }
        }
      },
      {
        "id": 1055,
        "action": "rollout",
        "bid_amount": null,
        "transaction": {
          "id": 1376,
          "txid": "1e46c34f547fb79f68cc297c6c5974acba4d5ad2f99297053c325f718f456a12",
          "block": {
            "time": 1728578686
          }
        }
      }
    ]
  },
  {
    "id": 306,
    "name": "@copy",
    "nameSha256": "2ad21d6186ea593bac46ef8dafdee406e9ac5bd4b0470541f089b1edd7cefbf4",
    "status": "registered",
    "bid_amount": 1000,
    "claimHeight": 43489,
    "spacesHistoryId": 971,
    "createdAt": "2024-10-02T20:52:29.635Z",
    "updatedAt": "2024-10-07T15:39:00.891Z",
    "rank": "61",
    "history": [
      {
        "id": 741,
        "action": "bid",
        "bid_amount": 1000,
        "transaction": {
          "id": 959,
          "txid": "3db14b10e6dff1dad71b4d5e93775d5bc9b7dbc5000708c1cbc6d5362afa3ee4",
          "block": {
            "time": 1724987894
          }
        }
      },
      {
        "id": 771,
        "action": "rollout",
        "bid_amount": null,
        "transaction": {
          "id": 980,
          "txid": "a597bd6da3574cba043c317748ecab5bd64534c5daffa78a5e7f8ac0e7403bd9",
          "block": {
            "time": 1725089125
          }
        }
      },
      {
        "id": 971,
        "action": "transfer",
        "bid_amount": null,
        "transaction": {
          "id": 1296,
          "txid": "a590439907ba16933d86799cae7613c04e8126eb206e4504573068605b0f3cc6",
          "block": {
            "time": 1728322721
          }
        }
      }
    ]
  },
  {
    "id": 385,
    "name": "@town",
    "nameSha256": "2debcd34990e7a10eb1d57285246272b08d4c3f14b8bffe8b1e3889997cdea61",
    "status": "auction",
    "bid_amount": 1000,
    "claimHeight": 50833,
    "spacesHistoryId": 1040,
    "createdAt": "2024-10-08T16:32:00.211Z",
    "updatedAt": "2024-10-10T05:23:00.074Z",
    "rank": "62",
    "history": [
      {
        "id": 1025,
        "action": "bid",
        "bid_amount": 1000,
        "transaction": {
          "id": 1365,
          "txid": "a06b4fac9dda67e9e67206bfb7419ae0741b8dd38b545c6d2d92fdb514196a8a",
          "block": {
            "time": 1728412271
          }
        }
      },
      {
        "id": 1040,
        "action": "rollout",
        "bid_amount": null,
        "transaction": {
          "id": 1375,
          "txid": "62fc9c12df7532ea2e099642b0e3803c00ba3abd96ea9e7e21c85e8e5552cabb",
          "block": {
            "time": 1728544952
          }
        }
      }
    ]
  },
  {
    "id": 266,
    "name": "@m",
    "nameSha256": "3083f7bea5211cc59675e8bb114d9cf88d1560920ba39d6f2196250f86608aa3",
    "status": "registered",
    "bid_amount": 1000,
    "claimHeight": 42337,
    "spacesHistoryId": 854,
    "createdAt": "2024-10-02T20:52:23.845Z",
    "updatedAt": "2024-10-02T20:52:34.112Z",
    "rank": "63",
    "history": [
      {
        "id": 629,
        "action": "bid",
        "bid_amount": 1000,
        "transaction": {
          "id": 825,
          "txid": "aff95905c3a2b2fae72b9e866844fe9adec64c8b1d936ae7dad3f5ff1c25459c",
          "block": {
            "time": 1724333680
          }
        }
      },
      {
        "id": 638,
        "action": "rollout",
        "bid_amount": null,
        "transaction": {
          "id": 837,
          "txid": "13775265c5051319c78d5e8397534cc6a0863912e3103bffa7c8d36e48e11813",
          "block": {
            "time": 1724436541
          }
        }
      },
      {
        "id": 854,
        "action": "transfer",
        "bid_amount": null,
        "transaction": {
          "id": 1061,
          "txid": "b1609e499f27aa75e1bd337e692c63fd2a64559555adb4878d082bc8ca316380",
          "block": {
            "time": 1725520217
          }
        }
      }
    ]
  },
  {
    "id": 292,
    "name": "@sol",
    "nameSha256": "309d2c7e4b1d9729eb01bd9de1095500a7851d069a29efea5904d3699050f024",
    "status": "registered",
    "bid_amount": 1000,
    "claimHeight": 43489,
    "spacesHistoryId": 972,
    "createdAt": "2024-10-02T20:52:29.427Z",
    "updatedAt": "2024-10-07T15:39:00.891Z",
    "rank": "64",
    "history": [
      {
        "id": 707,
        "action": "bid",
        "bid_amount": 1000,
        "transaction": {
          "id": 910,
          "txid": "ec111a5b9c08e6d3fc748d5b09d512711907817598bdc1bf166bde644f96ff62",
          "block": {
            "time": 1724985721
          }
        }
      },
      {
        "id": 774,
        "action": "rollout",
        "bid_amount": null,
        "transaction": {
          "id": 980,
          "txid": "a597bd6da3574cba043c317748ecab5bd64534c5daffa78a5e7f8ac0e7403bd9",
          "block": {
            "time": 1725089125
          }
        }
      },
      {
        "id": 972,
        "action": "transfer",
        "bid_amount": null,
        "transaction": {
          "id": 1297,
          "txid": "10efe55508f4948ee49b762992eb4fc2b0b1aeae4c3712092ae78cef58b09fed",
          "block": {
            "time": 1728322721
          }
        }
      }
    ]
  },
  {
    "id": 200,
    "name": "@free",
    "nameSha256": "30d2dc8d2ffb15f31dd7ee3744da7d99bc247adefbd76f55687b27f30243c56c",
    "status": "registered",
    "bid_amount": 1000,
    "claimHeight": 41905,
    "spacesHistoryId": 763,
    "createdAt": "2024-10-02T20:52:19.419Z",
    "updatedAt": "2024-10-02T20:52:30.684Z",
    "rank": "65",
    "history": [
      {
        "id": 498,
        "action": "bid",
        "bid_amount": 1000,
        "transaction": {
          "id": 674,
          "txid": "5f98b8c4bed432d4655803770eb9e22ad462931d2a1c2bd367f597e6926a1d52",
          "block": {
            "time": 1723908277
          }
        }
      },
      {
        "id": 575,
        "action": "rollout",
        "bid_amount": null,
        "transaction": {
          "id": 761,
          "txid": "36a384a9080e8f1f5a301919a064cf2725e2d59f886caa88ab697e1f9446788d",
          "block": {
            "time": 1724162284
          }
        }
      },
      {
        "id": 763,
        "action": "transfer",
        "bid_amount": null,
        "transaction": {
          "id": 976,
          "txid": "604d49ec36b24aea44f15fae7498fd024cbf9980b89ff5cb814a5cf8e10193ba",
          "block": {
            "time": 1725071514
          }
        }
      }
    ]
  },
  {
    "id": 241,
    "name": "@laser",
    "nameSha256": "32585b60c63f872d644c347faf5425b12a7451a42f5afbb40b92367065eeb05b",
    "status": "registered",
    "bid_amount": 1000,
    "claimHeight": 42049,
    "spacesHistoryId": 784,
    "createdAt": "2024-10-02T20:52:22.136Z",
    "updatedAt": "2024-10-02T20:52:31.319Z",
    "rank": "66",
    "history": [
      {
        "id": 583,
        "action": "bid",
        "bid_amount": 1000,
        "transaction": {
          "id": 769,
          "txid": "12505a1af89cb53476a744a4d1384087bd3fe084200a779a87f595afb223aaeb",
          "block": {
            "time": 1724163404
          }
        }
      },
      {
        "id": 609,
        "action": "rollout",
        "bid_amount": null,
        "transaction": {
          "id": 811,
          "txid": "b38f1a9aaa4ce4be5112ca50fe181b7880b1f8474c052a8662881295c38d0be3",
          "block": {
            "time": 1724255932
          }
        }
      },
      {
        "id": 784,
        "action": "transfer",
        "bid_amount": null,
        "transaction": {
          "id": 988,
          "txid": "bae64e803e30a962b99e50971e5aac6a1a608804123ea7c4ca71728e7e034c12",
          "block": {
            "time": 1725118410
          }
        }
      }
    ]
  },
  {
    "id": 232,
    "name": "@pro",
    "nameSha256": "335423714d00aba9d190e705168c72314b7bc2129b5395926683befe23f76149",
    "status": "registered",
    "bid_amount": 1000,
    "claimHeight": 41761,
    "spacesHistoryId": 722,
    "createdAt": "2024-10-02T20:52:20.865Z",
    "updatedAt": "2024-10-02T20:52:29.562Z",
    "rank": "67",
    "history": [
      {
        "id": 550,
        "action": "bid",
        "bid_amount": 1000,
        "transaction": {
          "id": 741,
          "txid": "5ba709d9b535a5c466d626446f39d1bc63510376573904e3c98e0899bb1ed535",
          "block": {
            "time": 1724033718
          }
        }
      },
      {
        "id": 563,
        "action": "rollout",
        "bid_amount": null,
        "transaction": {
          "id": 750,
          "txid": "ba0c795e2fad7da5562a80ebfb4909d27eb2c7e8809f9c79becc339272845979",
          "block": {
            "time": 1724077177
          }
        }
      },
      {
        "id": 722,
        "action": "transfer",
        "bid_amount": null,
        "transaction": {
          "id": 935,
          "txid": "8c4c1ba545967ef0c8ad017b2f5695e1fc1921b4922fdaacddeb5078d3e7a595",
          "block": {
            "time": 1724985490
          }
        }
      }
    ]
  },
  {
    "id": 259,
    "name": "@market",
    "nameSha256": "34d081000af6950a99cafbcdf30647ae7c7cb7d5f77a526e9b9ce2488168d98f",
    "status": "registered",
    "bid_amount": 1000,
    "claimHeight": 42481,
    "spacesHistoryId": 865,
    "createdAt": "2024-10-02T20:52:22.915Z",
    "updatedAt": "2024-10-02T20:52:34.413Z",
    "rank": "68",
    "history": [
      {
        "id": 602,
        "action": "bid",
        "bid_amount": 1000,
        "transaction": {
          "id": 806,
          "txid": "deb4c59e01b2f00166e52e19d6dc20e8cc6c90948f5e5839618667beb88636b8",
          "block": {
            "time": 1724251887
          }
        }
      },
      {
        "id": 654,
        "action": "rollout",
        "bid_amount": null,
        "transaction": {
          "id": 838,
          "txid": "a13b8ed005f9abfc95498f1ad20d89b3c0e8908f3698dde0d334effa39b5a55d",
          "block": {
            "time": 1724530590
          }
        }
      },
      {
        "id": 865,
        "action": "transfer",
        "bid_amount": null,
        "transaction": {
          "id": 1082,
          "txid": "3f9db5852cb2c6d92ae0468651a87304fdcccf3828138b74bb67bc63c8e84364",
          "block": {
            "time": 1725541244
          }
        }
      }
    ]
  },
  {
    "id": 249,
    "name": "@ledger",
    "nameSha256": "355283ddbb3f46cbdd22e99fd13aae35f172194c89ade51153fb15967f37d2e2",
    "status": "registered",
    "bid_amount": 1000,
    "claimHeight": 42049,
    "spacesHistoryId": 785,
    "createdAt": "2024-10-02T20:52:22.852Z",
    "updatedAt": "2024-10-02T20:52:31.319Z",
    "rank": "69",
    "history": [
      {
        "id": 592,
        "action": "bid",
        "bid_amount": 1000,
        "transaction": {
          "id": 786,
          "txid": "ec395d315d614196744cd7ce6c6995db054ebacbe31e0205163ab5702d22c62d",
          "block": {
            "time": 1724249541
          }
        }
      },
      {
        "id": 611,
        "action": "rollout",
        "bid_amount": null,
        "transaction": {
          "id": 811,
          "txid": "b38f1a9aaa4ce4be5112ca50fe181b7880b1f8474c052a8662881295c38d0be3",
          "block": {
            "time": 1724255932
          }
        }
      },
      {
        "id": 785,
        "action": "transfer",
        "bid_amount": null,
        "transaction": {
          "id": 989,
          "txid": "d7256168a1257b27d0005d5009ac91461592ee51147d20f1de5a9923fa6bc7eb",
          "block": {
            "time": 1725118410
          }
        }
      }
    ]
  },
  {
    "id": 210,
    "name": "@b",
    "nameSha256": "35ed6d1a3bdf08740f1a5271a192f941c276a7f4b3131b4d34f0794bd41a47d2",
    "status": "registered",
    "bid_amount": 1000,
    "claimHeight": 41473,
    "spacesHistoryId": 698,
    "createdAt": "2024-10-02T20:52:19.563Z",
    "updatedAt": "2024-10-02T20:52:29.398Z",
    "rank": "70",
    "history": [
      {
        "id": 508,
        "action": "bid",
        "bid_amount": 1000,
        "transaction": {
          "id": 695,
          "txid": "17de247746e5bc054304f132f8b15ee952c1305bbe6e46ac12420921c80b8ad8",
          "block": {
            "time": 1723915939
          }
        }
      },
      {
        "id": 517,
        "action": "rollout",
        "bid_amount": null,
        "transaction": {
          "id": 696,
          "txid": "748b434660b2026ece4275ad25e730a27321656b638c4e3929f65dcff689d1d2",
          "block": {
            "time": 1723926719
          }
        }
      },
      {
        "id": 698,
        "action": "transfer",
        "bid_amount": null,
        "transaction": {
          "id": 895,
          "txid": "d28a1231eba04af866a878578a99efc8fc8ef92aa14dee10dc8334af6a94628d",
          "block": {
            "time": 1724984520
          }
        }
      }
    ]
  },
  {
    "id": 394,
    "name": "@mytest1",
    "nameSha256": "3896c7ea3373fbb1dd8ad79461a4094eb8680deb537e2f5834f7e2c11dddd2e6",
    "status": "pre-auction",
    "bid_amount": 1000,
    "claimHeight": null,
    "spacesHistoryId": 1068,
    "createdAt": "2024-10-19T12:42:00.206Z",
    "updatedAt": "2024-10-19T12:42:00.206Z",
    "rank": "71",
    "history": [
      {
        "id": 1068,
        "action": "bid",
        "bid_amount": 1000,
        "transaction": {
          "id": 1395,
          "txid": "6ad0e8b019b33f360466b579d2fa6d56fd4d870d82243bc4f03623fea32764c7",
          "block": {
            "time": 1729341684
          }
        }
      }
    ]
  },
  {
    "id": 217,
    "name": "@comet",
    "nameSha256": "390f11604422575940a11c740f0cb30852fdd9d5af30ab4a941d68735033451d",
    "status": "registered",
    "bid_amount": 1000,
    "claimHeight": 41905,
    "spacesHistoryId": 761,
    "createdAt": "2024-10-02T20:52:19.805Z",
    "updatedAt": "2024-10-02T20:52:30.684Z",
    "rank": "72",
    "history": [
      {
        "id": 525,
        "action": "bid",
        "bid_amount": 1000,
        "transaction": {
          "id": 710,
          "txid": "b6ee7332208cf958ce20c78e4c631d10cfed480cf2a427ff165a153ca8247732",
          "block": {
            "time": 1723932235
          }
        }
      },
      {
        "id": 571,
        "action": "rollout",
        "bid_amount": null,
        "transaction": {
          "id": 761,
          "txid": "36a384a9080e8f1f5a301919a064cf2725e2d59f886caa88ab697e1f9446788d",
          "block": {
            "time": 1724162284
          }
        }
      },
      {
        "id": 761,
        "action": "transfer",
        "bid_amount": null,
        "transaction": {
          "id": 974,
          "txid": "6e5fce121b5fc36e606fb6e13b6751d2512db5bdaad0abb22cb1e63c4954697d",
          "block": {
            "time": 1725071514
          }
        }
      }
    ]
  },
  {
    "id": 340,
    "name": "@usd",
    "nameSha256": "39d043c42bac851eebe2e03c67968141a8258fd19f3faf0b4013b6bd78497488",
    "status": "registered",
    "bid_amount": 1000,
    "claimHeight": 44209,
    "spacesHistoryId": 931,
    "createdAt": "2024-10-02T20:52:34.413Z",
    "updatedAt": "2024-10-07T14:42:00.815Z",
    "rank": "73",
    "history": [
      {
        "id": 874,
        "action": "bid",
        "bid_amount": 1000,
        "transaction": {
          "id": 1091,
          "txid": "cefdd1466b5b6a5ccf62e6bece3649430feb2560f5b5b102258cb0ab6a31599c",
          "block": {
            "time": 1725541244
          }
        }
      },
      {
        "id": 900,
        "action": "rollout",
        "bid_amount": null,
        "transaction": {
          "id": 1163,
          "txid": "bdbf6d1820f81455ffe142efeb5568b4f6ce9b82a769bbe32a053832e8bfdc10",
          "block": {
            "time": 1725583181
          }
        }
      },
      {
        "id": 931,
        "action": "transfer",
        "bid_amount": null,
        "transaction": {
          "id": 1240,
          "txid": "3b2e15f5af27fc2032ca5f3b207f8fc8339d71868f6a42a0ff72cd6747719d0b",
          "block": {
            "time": 1728319307
          }
        }
      }
    ]
  },
  {
    "id": 221,
    "name": "@ace",
    "nameSha256": "3b31549aec67dab0d27ac6539e472a3d0447f16b8e4c01c57cf057ff5974c977",
    "status": "registered",
    "bid_amount": 1000,
    "claimHeight": 41617,
    "spacesHistoryId": 696,
    "createdAt": "2024-10-02T20:52:19.875Z",
    "updatedAt": "2024-10-02T20:52:29.398Z",
    "rank": "74",
    "history": [
      {
        "id": 529,
        "action": "bid",
        "bid_amount": 1000,
        "transaction": {
          "id": 718,
          "txid": "f7caa513d7b7c68144a049e66d9368e8fb27877c4d2345f80eef04742809615d",
          "block": {
            "time": 1723935446
          }
        }
      },
      {
        "id": 535,
        "action": "rollout",
        "bid_amount": null,
        "transaction": {
          "id": 729,
          "txid": "ed5fbad05e3c895cb4e183b1df94ec6928bad102c4ad689f7cc339bac8def4de",
          "block": {
            "time": 1723994427
          }
        }
      },
      {
        "id": 696,
        "action": "transfer",
        "bid_amount": null,
        "transaction": {
          "id": 893,
          "txid": "dae9fa3aeffeb00acfbdb6f2f9acf969ce101fa9f1df013008e4b803e4b9aacc",
          "block": {
            "time": 1724984520
          }
        }
      }
    ]
  },
  {
    "id": 215,
    "name": "@jupiter",
    "nameSha256": "3cc3bd7ea62291dfe854558dc8661a7e46debc448108c9ad58ee8c309c90a273",
    "status": "registered",
    "bid_amount": 1000,
    "claimHeight": 41617,
    "spacesHistoryId": 695,
    "createdAt": "2024-10-02T20:52:19.805Z",
    "updatedAt": "2024-10-02T20:52:29.398Z",
    "rank": "75",
    "history": [
      {
        "id": 523,
        "action": "bid",
        "bid_amount": 1000,
        "transaction": {
          "id": 706,
          "txid": "7106ba65b489a498d765eb65a0155f6a90fa9aa54ee0a313e6de4a0fd175f97c",
          "block": {
            "time": 1723932235
          }
        }
      },
      {
        "id": 537,
        "action": "rollout",
        "bid_amount": null,
        "transaction": {
          "id": 729,
          "txid": "ed5fbad05e3c895cb4e183b1df94ec6928bad102c4ad689f7cc339bac8def4de",
          "block": {
            "time": 1723994427
          }
        }
      },
      {
        "id": 695,
        "action": "transfer",
        "bid_amount": null,
        "transaction": {
          "id": 892,
          "txid": "de04a963d99ce249534b44767362cb72aa946d9a9d537e73d142de72fe3f550e",
          "block": {
            "time": 1724984520
          }
        }
      }
    ]
  },
  {
    "id": 331,
    "name": "@connect",
    "nameSha256": "3d73502b31f0eabaa2cfd55df0ff363c5e9721b469eca6caac9692a89741b67e",
    "status": "registered",
    "bid_amount": 1000,
    "claimHeight": 43777,
    "spacesHistoryId": 914,
    "createdAt": "2024-10-02T20:52:31.758Z",
    "updatedAt": "2024-10-07T14:22:00.091Z",
    "rank": "76",
    "history": [
      {
        "id": 807,
        "action": "bid",
        "bid_amount": 1000,
        "transaction": {
          "id": 1034,
          "txid": "29e73d0370f30e4861c1a14888079c6283255346581058f5b71339660e5ea8e8",
          "block": {
            "time": 1725154762
          }
        }
      },
      {
        "id": 830,
        "action": "rollout",
        "bid_amount": null,
        "transaction": {
          "id": 1043,
          "txid": "6d3e3777b3aaef22cbe5374c1dd946f59fff9821e182ee09bec3ae5a3a855205",
          "block": {
            "time": 1725381834
          }
        }
      },
      {
        "id": 914,
        "action": "transfer",
        "bid_amount": null,
        "transaction": {
          "id": 1223,
          "txid": "d3e6e6512bbd3507c542f73e70d993e7f10a01877f755a45fee057b37b43ddc4",
          "block": {
            "time": 1728312983
          }
        }
      }
    ]
  },
  {
    "id": 211,
    "name": "@moon",
    "nameSha256": "3e5f6d9e9078049c9ad7e9a146568aede2695ef8be30694d27e3ff13ed97239e",
    "status": "registered",
    "bid_amount": 1000,
    "claimHeight": 41617,
    "spacesHistoryId": 730,
    "createdAt": "2024-10-02T20:52:19.805Z",
    "updatedAt": "2024-10-02T20:52:29.562Z",
    "rank": "77",
    "history": [
      {
        "id": 519,
        "action": "bid",
        "bid_amount": 1000,
        "transaction": {
          "id": 698,
          "txid": "e4dbb2725eb2597658e51d9921e1fdbee0efe78f2a7e3241866de1fd0623d456",
          "block": {
            "time": 1723932235
          }
        }
      },
      {
        "id": 538,
        "action": "rollout",
        "bid_amount": null,
        "transaction": {
          "id": 729,
          "txid": "ed5fbad05e3c895cb4e183b1df94ec6928bad102c4ad689f7cc339bac8def4de",
          "block": {
            "time": 1723994427
          }
        }
      },
      {
        "id": 730,
        "action": "transfer",
        "bid_amount": null,
        "transaction": {
          "id": 943,
          "txid": "37807242c95990a2666361e38ebb0cecabd690f43bfbdc80c170a7b8d38d4310",
          "block": {
            "time": 1724985490
          }
        }
      }
    ]
  },
  {
    "id": 354,
    "name": "@ghost",
    "nameSha256": "3f19524152730d3332ea21c6a3151e77ec776d468877ad777eff7e9e17a9e98e",
    "status": "auction",
    "bid_amount": 1000,
    "claimHeight": 50833,
    "spacesHistoryId": 1046,
    "createdAt": "2024-10-07T14:56:00.373Z",
    "updatedAt": "2024-10-10T05:23:00.074Z",
    "rank": "78",
    "history": [
      {
        "id": 945,
        "action": "bid",
        "bid_amount": 1000,
        "transaction": {
          "id": 1263,
          "txid": "1eb867b983bb740ff0305e72b79cedffa1de226d23748ab9f943751916c695c8",
          "block": {
            "time": 1728315456
          }
        }
      },
      {
        "id": 1046,
        "action": "rollout",
        "bid_amount": null,
        "transaction": {
          "id": 1375,
          "txid": "62fc9c12df7532ea2e099642b0e3803c00ba3abd96ea9e7e21c85e8e5552cabb",
          "block": {
            "time": 1728544952
          }
        }
      }
    ]
  },
  {
    "id": 368,
    "name": "@am",
    "nameSha256": "4010e0290624f995f6fde36c0d15b97bb5727e725e47cdbd1e997895ac24872a",
    "status": "auction",
    "bid_amount": 1000,
    "claimHeight": 51121,
    "spacesHistoryId": 1062,
    "createdAt": "2024-10-08T15:51:00.726Z",
    "updatedAt": "2024-10-11T01:13:00.785Z",
    "rank": "79",
    "history": [
      {
        "id": 1008,
        "action": "bid",
        "bid_amount": 1000,
        "transaction": {
          "id": 1335,
          "txid": "3a80566c34822ece411e4113afbd31423fd2d87a44e1bb04b4d8da5085a8fa9b",
          "block": {
            "time": 1728409829
          }
        }
      },
      {
        "id": 1062,
        "action": "rollout",
        "bid_amount": null,
        "transaction": {
          "id": 1377,
          "txid": "44f0b479f7c1e1b4f6120e26b958b2e0a29a336ace75c6f06f763f3ab9627361",
          "block": {
            "time": 1728613773
          }
        }
      }
    ]
  },
  {
    "id": 236,
    "name": "@aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
    "nameSha256": "42208ea764aaa2d8744451531324f6dfef88528dc247e46846ef9ffd6a81376c",
    "status": "registered",
    "bid_amount": 1000,
    "claimHeight": 41761,
    "spacesHistoryId": 955,
    "createdAt": "2024-10-02T20:52:20.989Z",
    "updatedAt": "2024-10-07T14:56:00.373Z",
    "rank": "80",
    "history": [
      {
        "id": 554,
        "action": "bid",
        "bid_amount": 1000,
        "transaction": {
          "id": 749,
          "txid": "c63ede91d4a2c42d87831f49cf7eebacdf46f1f5d3e72311164873fce4926deb",
          "block": {
            "time": 1724035993
          }
        }
      },
      {
        "id": 561,
        "action": "rollout",
        "bid_amount": null,
        "transaction": {
          "id": 750,
          "txid": "ba0c795e2fad7da5562a80ebfb4909d27eb2c7e8809f9c79becc339272845979",
          "block": {
            "time": 1724077177
          }
        }
      },
      {
        "id": 955,
        "action": "transfer",
        "bid_amount": null,
        "transaction": {
          "id": 1280,
          "txid": "089fddea1f70c2aa333217721a2537002a90c9dfb2f2c2a41ffae9931dd2963f",
          "block": {
            "time": 1728315456
          }
        }
      }
    ]
  },
  {
    "id": 330,
    "name": "@info",
    "nameSha256": "42d8f51133a2a8c4ff93ab3bff00c97e1620f0e54811c5b46c5a11f02bb0380f",
    "status": "registered",
    "bid_amount": 1000,
    "claimHeight": 43777,
    "spacesHistoryId": 915,
    "createdAt": "2024-10-02T20:52:31.758Z",
    "updatedAt": "2024-10-07T14:22:00.091Z",
    "rank": "81",
    "history": [
      {
        "id": 806,
        "action": "bid",
        "bid_amount": 1000,
        "transaction": {
          "id": 1032,
          "txid": "c7a4bc385f83e8b10f6a6d7937c59d33e709d7147222ffb76bfc88f85ef29d81",
          "block": {
            "time": 1725154762
          }
        }
      },
      {
        "id": 829,
        "action": "rollout",
        "bid_amount": null,
        "transaction": {
          "id": 1043,
          "txid": "6d3e3777b3aaef22cbe5374c1dd946f59fff9821e182ee09bec3ae5a3a855205",
          "block": {
            "time": 1725381834
          }
        }
      },
      {
        "id": 915,
        "action": "transfer",
        "bid_amount": null,
        "transaction": {
          "id": 1224,
          "txid": "1cfbf036374a078fa74afafda60f8c9a7b676180d00180ce6990c63f16ad2648",
          "block": {
            "time": 1728312983
          }
        }
      }
    ]
  },
  {
    "id": 326,
    "name": "@tor",
    "nameSha256": "442a20f8eab01668259c916bad813b0cc5c329dd227caf876383832c537c483a",
    "status": "registered",
    "bid_amount": 1000,
    "claimHeight": 43633,
    "spacesHistoryId": 983,
    "createdAt": "2024-10-02T20:52:31.758Z",
    "updatedAt": "2024-10-07T15:39:00.891Z",
    "rank": "82",
    "history": [
      {
        "id": 802,
        "action": "bid",
        "bid_amount": 1000,
        "transaction": {
          "id": 1024,
          "txid": "65d24b3556a6290aad417db7991ac51cacd846eb945b6272ca6ed22c986f45df",
          "block": {
            "time": 1725154762
          }
        }
      },
      {
        "id": 811,
        "action": "rollout",
        "bid_amount": null,
        "transaction": {
          "id": 1041,
          "txid": "df17732535dbf2580795415b751e95e2b94633d0ee623f2883458e1587d5936f",
          "block": {
            "time": 1725168709
          }
        }
      },
      {
        "id": 983,
        "action": "transfer",
        "bid_amount": null,
        "transaction": {
          "id": 1308,
          "txid": "832c7754a5294058884f54a649ecf5106fc229a7c94e28081883d459ec648cb9",
          "block": {
            "time": 1728322721
          }
        }
      }
    ]
  },
  {
    "id": 243,
    "name": "@auction",
    "nameSha256": "44f3433873af9e70deccbccde6d0e9c3c15bd2adcc15ac0083ef19011e3466df",
    "status": "registered",
    "bid_amount": 1000,
    "claimHeight": 42193,
    "spacesHistoryId": 841,
    "createdAt": "2024-10-02T20:52:22.136Z",
    "updatedAt": "2024-10-02T20:52:34.112Z",
    "rank": "83",
    "history": [
      {
        "id": 585,
        "action": "bid",
        "bid_amount": 1000,
        "transaction": {
          "id": 773,
          "txid": "ebf946f8bf1ba1b73a45ecba2593e1a83f78beabef2c5981b87614e18ca6314e",
          "block": {
            "time": 1724163404
          }
        }
      },
      {
        "id": 620,
        "action": "rollout",
        "bid_amount": null,
        "transaction": {
          "id": 816,
          "txid": "7af1e824358c2644ef73e4e1ebde8d2fe27ed5ee4af29dc068bc723080ccbb1d",
          "block": {
            "time": 1724329893
          }
        }
      },
      {
        "id": 841,
        "action": "transfer",
        "bid_amount": null,
        "transaction": {
          "id": 1048,
          "txid": "ac8f1c0c3ed280c8c1ad8b9dad2d2e34f499a790a66b794a51ce33b6f2296806",
          "block": {
            "time": 1725520217
          }
        }
      }
    ]
  },
  {
    "id": 227,
    "name": "@cat",
    "nameSha256": "4ce361dc79fa5cdde29b7561bc0481165f12b8ad11a4a1357a284585f9c32796",
    "status": "registered",
    "bid_amount": 1000,
    "claimHeight": 41761,
    "spacesHistoryId": 723,
    "createdAt": "2024-10-02T20:52:20.865Z",
    "updatedAt": "2024-10-02T20:52:29.562Z",
    "rank": "84",
    "history": [
      {
        "id": 545,
        "action": "bid",
        "bid_amount": 1000,
        "transaction": {
          "id": 731,
          "txid": "a9a9c8e236dbde7d05d7c7522e665fadd982d43e103b4e0f20fe2acba3650924",
          "block": {
            "time": 1724033718
          }
        }
      },
      {
        "id": 560,
        "action": "rollout",
        "bid_amount": null,
        "transaction": {
          "id": 750,
          "txid": "ba0c795e2fad7da5562a80ebfb4909d27eb2c7e8809f9c79becc339272845979",
          "block": {
            "time": 1724077177
          }
        }
      },
      {
        "id": 723,
        "action": "transfer",
        "bid_amount": null,
        "transaction": {
          "id": 936,
          "txid": "539ab72ea56ac27e5ed454feeae71610ea950699a810ad1ff99f67c9180b0736",
          "block": {
            "time": 1724985490
          }
        }
      }
    ]
  },
  {
    "id": 269,
    "name": "@pull",
    "nameSha256": "4ce5f1be54b3c957900a99105566246df761c8efb27f21306f7debce04c39a14",
    "status": "registered",
    "bid_amount": 1000,
    "claimHeight": 42337,
    "spacesHistoryId": 849,
    "createdAt": "2024-10-02T20:52:23.845Z",
    "updatedAt": "2024-10-02T20:52:34.112Z",
    "rank": "85",
    "history": [
      {
        "id": 632,
        "action": "bid",
        "bid_amount": 1000,
        "transaction": {
          "id": 828,
          "txid": "d7648f8bb2b7547b836583fc12d9f8ca782d432cb3ed87eb42a8378c707e4b7e",
          "block": {
            "time": 1724333680
          }
        }
      },
      {
        "id": 643,
        "action": "rollout",
        "bid_amount": null,
        "transaction": {
          "id": 837,
          "txid": "13775265c5051319c78d5e8397534cc6a0863912e3103bffa7c8d36e48e11813",
          "block": {
            "time": 1724436541
          }
        }
      },
      {
        "id": 849,
        "action": "transfer",
        "bid_amount": null,
        "transaction": {
          "id": 1056,
          "txid": "8116ace8638b5ea2771275d056f7b72c5ec565174db1f4d8d8af7a3ef1eb53d1",
          "block": {
            "time": 1725520217
          }
        }
      }
    ]
  },
  {
    "id": 311,
    "name": "@deliver",
    "nameSha256": "4f2803bf1a15d39f6f61131f6275afe749d5c321db0fea9516af7aa3e35820a6",
    "status": "registered",
    "bid_amount": 1000,
    "claimHeight": 43921,
    "spacesHistoryId": 921,
    "createdAt": "2024-10-02T20:52:31.388Z",
    "updatedAt": "2024-10-07T14:22:00.127Z",
    "rank": "86",
    "history": [
      {
        "id": 787,
        "action": "bid",
        "bid_amount": 1000,
        "transaction": {
          "id": 993,
          "txid": "9f60e67231706af40953a92fa0c33a7e614ae1c08d549016049c9221d3ed4c5d",
          "block": {
            "time": 1725121917
          }
        }
      },
      {
        "id": 833,
        "action": "rollout",
        "bid_amount": null,
        "transaction": {
          "id": 1044,
          "txid": "39c2aa36c7f805af0f9dd249a1737169be1defe5f0a69da9007f7df9f521526b",
          "block": {
            "time": 1725450337
          }
        }
      },
      {
        "id": 921,
        "action": "transfer",
        "bid_amount": null,
        "transaction": {
          "id": 1230,
          "txid": "6ced9c709649db5660d2752d0ff53f6da6c0c9c2f97bdbe0e23fc85af83fefc9",
          "block": {
            "time": 1728314204
          }
        }
      }
    ]
  },
  {
    "id": 261,
    "name": "@golf",
    "nameSha256": "4f961aaa02e3842ecebc4fd4975bb75d70cbafeb1a13e72bff388478d554e299",
    "status": "registered",
    "bid_amount": 1000,
    "claimHeight": 42481,
    "spacesHistoryId": 869,
    "createdAt": "2024-10-02T20:52:22.962Z",
    "updatedAt": "2024-10-02T20:52:34.413Z",
    "rank": "87",
    "history": [
      {
        "id": 604,
        "action": "bid",
        "bid_amount": 1000,
        "transaction": {
          "id": 810,
          "txid": "de6390d38a47601024e83d0c561d1285515b6921b9f7e95e7513ccd22c62fabd",
          "block": {
            "time": 1724252441
          }
        }
      },
      {
        "id": 656,
        "action": "rollout",
        "bid_amount": null,
        "transaction": {
          "id": 838,
          "txid": "a13b8ed005f9abfc95498f1ad20d89b3c0e8908f3698dde0d334effa39b5a55d",
          "block": {
            "time": 1724530590
          }
        }
      },
      {
        "id": 869,
        "action": "transfer",
        "bid_amount": null,
        "transaction": {
          "id": 1086,
          "txid": "e1b78372719e25093ff1d2d313b1200b65c6dfedc047b75a6d5f2ac9cedc0314",
          "block": {
            "time": 1725541244
          }
        }
      }
    ]
  },
  {
    "id": 198,
    "name": "@cash",
    "nameSha256": "4fab9421a51ae7701f115daa576878099910934ecca16f9440dbbc02d85ed5ff",
    "status": "registered",
    "bid_amount": 1000,
    "claimHeight": 41473,
    "spacesHistoryId": 693,
    "createdAt": "2024-10-02T20:52:19.419Z",
    "updatedAt": "2024-10-02T20:52:29.398Z",
    "rank": "88",
    "history": [
      {
        "id": 496,
        "action": "bid",
        "bid_amount": 1000,
        "transaction": {
          "id": 670,
          "txid": "01831add8c2da8fc24cf23880d3c3f7c446559fcdcfdd7fd0f63bf84ac45c713",
          "block": {
            "time": 1723908277
          }
        }
      },
      {
        "id": 511,
        "action": "rollout",
        "bid_amount": null,
        "transaction": {
          "id": 696,
          "txid": "748b434660b2026ece4275ad25e730a27321656b638c4e3929f65dcff689d1d2",
          "block": {
            "time": 1723926719
          }
        }
      },
      {
        "id": 693,
        "action": "transfer",
        "bid_amount": null,
        "transaction": {
          "id": 890,
          "txid": "6a79d4101d2235c87c725be07205ad4133efe67734f9bfa2493c32991dec3379",
          "block": {
            "time": 1724984520
          }
        }
      }
    ]
  },
  {
    "id": 338,
    "name": "@fee",
    "nameSha256": "508bf5bfb07b1a66ba1d89bd0c40350e32ce62312bcb3b767e3d76211c138206",
    "status": "registered",
    "bid_amount": 1000,
    "claimHeight": 44209,
    "spacesHistoryId": 930,
    "createdAt": "2024-10-02T20:52:34.413Z",
    "updatedAt": "2024-10-07T14:42:00.815Z",
    "rank": "89",
    "history": [
      {
        "id": 872,
        "action": "bid",
        "bid_amount": 1000,
        "transaction": {
          "id": 1089,
          "txid": "fd04ead03e92d3991d2b95e5086197c8ec15499fa1e3fb6d333366366a01481b",
          "block": {
            "time": 1725541244
          }
        }
      },
      {
        "id": 895,
        "action": "rollout",
        "bid_amount": null,
        "transaction": {
          "id": 1163,
          "txid": "bdbf6d1820f81455ffe142efeb5568b4f6ce9b82a769bbe32a053832e8bfdc10",
          "block": {
            "time": 1725583181
          }
        }
      },
      {
        "id": 930,
        "action": "transfer",
        "bid_amount": null,
        "transaction": {
          "id": 1239,
          "txid": "47ca41e265bc1a63aebabb9fcb426a8b4bb821df6b3a139fa24f97920150432b",
          "block": {
            "time": 1728319307
          }
        }
      }
    ]
  },
  {
    "id": 332,
    "name": "@error",
    "nameSha256": "50cc1806ae215a18b9ffc72253450d3983dec7dd903c95222cae3f7a0e0f3849",
    "status": "registered",
    "bid_amount": 1000,
    "claimHeight": 43633,
    "spacesHistoryId": 981,
    "createdAt": "2024-10-02T20:52:31.758Z",
    "updatedAt": "2024-10-07T15:39:00.891Z",
    "rank": "90",
    "history": [
      {
        "id": 808,
        "action": "bid",
        "bid_amount": 1000,
        "transaction": {
          "id": 1036,
          "txid": "fcae96cd336e2f9317f7be16e8bdfab23cc256dd81a8702affd82f48d3987b50",
          "block": {
            "time": 1725154762
          }
        }
      },
      {
        "id": 814,
        "action": "rollout",
        "bid_amount": null,
        "transaction": {
          "id": 1041,
          "txid": "df17732535dbf2580795415b751e95e2b94633d0ee623f2883458e1587d5936f",
          "block": {
            "time": 1725168709
          }
        }
      },
      {
        "id": 981,
        "action": "transfer",
        "bid_amount": null,
        "transaction": {
          "id": 1306,
          "txid": "bff3706ec1a53cf95554d63b5cc5d7b5ebd240477bd7addfdf4f3785708dcab5",
          "block": {
            "time": 1728322721
          }
        }
      }
    ]
  },
  {
    "id": 270,
    "name": "@mad",
    "nameSha256": "526a735a559654f811880f85b9c77f7a8523bf03bfbe5af739d615aee45d1b9c",
    "status": "registered",
    "bid_amount": 1000,
    "claimHeight": 42337,
    "spacesHistoryId": 851,
    "createdAt": "2024-10-02T20:52:23.902Z",
    "updatedAt": "2024-10-02T20:52:34.112Z",
    "rank": "91",
    "history": [
      {
        "id": 633,
        "action": "bid",
        "bid_amount": 1000,
        "transaction": {
          "id": 830,
          "txid": "8d983ff995683ef3c661fb881246b39912f9e9863c5fc407aee49078033c9de1",
          "block": {
            "time": 1724336088
          }
        }
      },
      {
        "id": 642,
        "action": "rollout",
        "bid_amount": null,
        "transaction": {
          "id": 837,
          "txid": "13775265c5051319c78d5e8397534cc6a0863912e3103bffa7c8d36e48e11813",
          "block": {
            "time": 1724436541
          }
        }
      },
      {
        "id": 851,
        "action": "transfer",
        "bid_amount": null,
        "transaction": {
          "id": 1058,
          "txid": "0085827ec4338972a84bcffa64ababb601f04ec540a6724feae1c49b53b47f39",
          "block": {
            "time": 1725520217
          }
        }
      }
    ]
  },
  {
    "id": 245,
    "name": "@rack",
    "nameSha256": "544865b935b8a5d9fc9eb9dd781f4b60b59e1c8405eedc8f0e6e4a9e11af36b8",
    "status": "registered",
    "bid_amount": 1000,
    "claimHeight": 42193,
    "spacesHistoryId": 843,
    "createdAt": "2024-10-02T20:52:22.852Z",
    "updatedAt": "2024-10-02T20:52:34.112Z",
    "rank": "92",
    "history": [
      {
        "id": 588,
        "action": "bid",
        "bid_amount": 1000,
        "transaction": {
          "id": 778,
          "txid": "09c3bc5f069da095b7c2cae3e2fb9b63b04937c7ff6423154eaabaf1c9ebb550",
          "block": {
            "time": 1724249541
          }
        }
      },
      {
        "id": 625,
        "action": "rollout",
        "bid_amount": null,
        "transaction": {
          "id": 816,
          "txid": "7af1e824358c2644ef73e4e1ebde8d2fe27ed5ee4af29dc068bc723080ccbb1d",
          "block": {
            "time": 1724329893
          }
        }
      },
      {
        "id": 843,
        "action": "transfer",
        "bid_amount": null,
        "transaction": {
          "id": 1050,
          "txid": "69ab2f5ef5f0863ff75e1a2e960bc38b22d7a864a1a348370b6c61d37945374a",
          "block": {
            "time": 1725520217
          }
        }
      }
    ]
  },
  {
    "id": 324,
    "name": "@editor",
    "nameSha256": "54edecb4905c4ebeb579196f5b707a842db58875dfe9bbce603d0e91ed3662a9",
    "status": "registered",
    "bid_amount": 1000,
    "claimHeight": 43633,
    "spacesHistoryId": 977,
    "createdAt": "2024-10-02T20:52:31.758Z",
    "updatedAt": "2024-10-07T15:39:00.891Z",
    "rank": "93",
    "history": [
      {
        "id": 800,
        "action": "bid",
        "bid_amount": 1000,
        "transaction": {
          "id": 1020,
          "txid": "7bf47b9023df4afe61b020bbf1ef00b0562b86b04d905927eb848311ef4a454b",
          "block": {
            "time": 1725154762
          }
        }
      },
      {
        "id": 819,
        "action": "rollout",
        "bid_amount": null,
        "transaction": {
          "id": 1041,
          "txid": "df17732535dbf2580795415b751e95e2b94633d0ee623f2883458e1587d5936f",
          "block": {
            "time": 1725168709
          }
        }
      },
      {
        "id": 977,
        "action": "transfer",
        "bid_amount": null,
        "transaction": {
          "id": 1302,
          "txid": "1aa5c850f3a3bd8707ab034c163a8c05f200e8bcf369a59fba4bbd0263a41e34",
          "block": {
            "time": 1728322721
          }
        }
      }
    ]
  },
  {
    "id": 262,
    "name": "@mail",
    "nameSha256": "551aaceec784d4bd5d4020cfd4a44c47b252cd6b8da7ed3a7edf3b64b772c157",
    "status": "registered",
    "bid_amount": 1000,
    "claimHeight": 42193,
    "spacesHistoryId": 842,
    "createdAt": "2024-10-02T20:52:23.116Z",
    "updatedAt": "2024-10-02T20:52:34.112Z",
    "rank": "94",
    "history": [
      {
        "id": 615,
        "action": "bid",
        "bid_amount": 1000,
        "transaction": {
          "id": 814,
          "txid": "3c422862a71c1bbada5ee7152cd41966c1acfe611a37f72d49bb56a9c2d77477",
          "block": {
            "time": 1724265829
          }
        }
      },
      {
        "id": 617,
        "action": "rollout",
        "bid_amount": null,
        "transaction": {
          "id": 816,
          "txid": "7af1e824358c2644ef73e4e1ebde8d2fe27ed5ee4af29dc068bc723080ccbb1d",
          "block": {
            "time": 1724329893
          }
        }
      },
      {
        "id": 842,
        "action": "transfer",
        "bid_amount": null,
        "transaction": {
          "id": 1049,
          "txid": "22f706d05f984f327e82e9062b29dbd5ebb0c2d67021a251764c923ac4a68130",
          "block": {
            "time": 1725520217
          }
        }
      }
    ]
  },
  {
    "id": 327,
    "name": "@2",
    "nameSha256": "558c7d0c2a2b20c2207037ff074a7ea446b1994f2bcd45d5532136033032ae42",
    "status": "registered",
    "bid_amount": 1000,
    "claimHeight": 43777,
    "spacesHistoryId": 916,
    "createdAt": "2024-10-02T20:52:31.758Z",
    "updatedAt": "2024-10-07T14:22:00.091Z",
    "rank": "95",
    "history": [
      {
        "id": 803,
        "action": "bid",
        "bid_amount": 1000,
        "transaction": {
          "id": 1026,
          "txid": "9f0977581d98e97b5456565cd2fd4fb6a1d7119c9c0f90707ae464c87c94a045",
          "block": {
            "time": 1725154762
          }
        }
      },
      {
        "id": 831,
        "action": "rollout",
        "bid_amount": null,
        "transaction": {
          "id": 1043,
          "txid": "6d3e3777b3aaef22cbe5374c1dd946f59fff9821e182ee09bec3ae5a3a855205",
          "block": {
            "time": 1725381834
          }
        }
      },
      {
        "id": 916,
        "action": "transfer",
        "bid_amount": null,
        "transaction": {
          "id": 1225,
          "txid": "ffae7c3dc1c14c56c37c9438e7b6c660dc62d6fc0e900a6811bc2c7f709f1976",
          "block": {
            "time": 1728312983
          }
        }
      }
    ]
  },
  {
    "id": 375,
    "name": "@pickle",
    "nameSha256": "5678894934f5071c6732aae861eecbe8a7a7727f34268c2b34a65633ac0940eb",
    "status": "auction",
    "bid_amount": 1000,
    "claimHeight": 50977,
    "spacesHistoryId": 1052,
    "createdAt": "2024-10-08T15:55:00.897Z",
    "updatedAt": "2024-10-10T15:40:00.396Z",
    "rank": "96",
    "history": [
      {
        "id": 1015,
        "action": "bid",
        "bid_amount": 1000,
        "transaction": {
          "id": 1345,
          "txid": "49fb98e48b4894d9d58ce093290ddccfd4b17ece313662ecf96ab8248b08f55b",
          "block": {
            "time": 1728403843
          }
        }
      },
      {
        "id": 1052,
        "action": "rollout",
        "bid_amount": null,
        "transaction": {
          "id": 1376,
          "txid": "1e46c34f547fb79f68cc297c6c5974acba4d5ad2f99297053c325f718f456a12",
          "block": {
            "time": 1728578686
          }
        }
      }
    ]
  },
  {
    "id": 378,
    "name": "@in",
    "nameSha256": "599be01e4fbd00e347c6fce281c15940f21b3e5a53110c32185383dcbe88a37d",
    "status": "auction",
    "bid_amount": 1000,
    "claimHeight": 50833,
    "spacesHistoryId": 1047,
    "createdAt": "2024-10-08T16:32:00.211Z",
    "updatedAt": "2024-10-10T05:23:00.074Z",
    "rank": "97",
    "history": [
      {
        "id": 1018,
        "action": "bid",
        "bid_amount": 1000,
        "transaction": {
          "id": 1352,
          "txid": "071497a1c0614ffca35bba8917444fcaff551d3b2281be059d6b9472d642000b",
          "block": {
            "time": 1728412271
          }
        }
      },
      {
        "id": 1047,
        "action": "rollout",
        "bid_amount": null,
        "transaction": {
          "id": 1375,
          "txid": "62fc9c12df7532ea2e099642b0e3803c00ba3abd96ea9e7e21c85e8e5552cabb",
          "block": {
            "time": 1728544952
          }
        }
      }
    ]
  },
  {
    "id": 265,
    "name": "@commit",
    "nameSha256": "5beed23b0fe0bfd80b4a28fcddbceb977bde0ac6ddc032b5e32c4ccd58dc64e7",
    "status": "registered",
    "bid_amount": 1000,
    "claimHeight": 42481,
    "spacesHistoryId": 866,
    "createdAt": "2024-10-02T20:52:23.845Z",
    "updatedAt": "2024-10-02T20:52:34.413Z",
    "rank": "98",
    "history": [
      {
        "id": 628,
        "action": "bid",
        "bid_amount": 1000,
        "transaction": {
          "id": 824,
          "txid": "52795672248adcad57208b58dcc7130e3285d9970da49cefb5b6230fb03ebe4f",
          "block": {
            "time": 1724333680
          }
        }
      },
      {
        "id": 652,
        "action": "rollout",
        "bid_amount": null,
        "transaction": {
          "id": 838,
          "txid": "a13b8ed005f9abfc95498f1ad20d89b3c0e8908f3698dde0d334effa39b5a55d",
          "block": {
            "time": 1724530590
          }
        }
      },
      {
        "id": 866,
        "action": "transfer",
        "bid_amount": null,
        "transaction": {
          "id": 1083,
          "txid": "9f12ad2b8ba78acf2b8526c66b42e308bf299ab36b96bcfae3e30a9c85f5d7ca",
          "block": {
            "time": 1725541244
          }
        }
      }
    ]
  },
  {
    "id": 251,
    "name": "@avatar",
    "nameSha256": "5e5b4f47ec797b2b4c0781894b357b6b0a095444bd8f94e51a53807dd31ef261",
    "status": "registered",
    "bid_amount": 1000,
    "claimHeight": 42049,
    "spacesHistoryId": 777,
    "createdAt": "2024-10-02T20:52:22.852Z",
    "updatedAt": "2024-10-02T20:52:31.319Z",
    "rank": "99",
    "history": [
      {
        "id": 594,
        "action": "bid",
        "bid_amount": 1000,
        "transaction": {
          "id": 790,
          "txid": "2b33aafe3a26cc5c425ecff10b575e366a1994a91a9aa48e262757ec6f0fbf6c",
          "block": {
            "time": 1724249541
          }
        }
      },
      {
        "id": 606,
        "action": "rollout",
        "bid_amount": null,
        "transaction": {
          "id": 811,
          "txid": "b38f1a9aaa4ce4be5112ca50fe181b7880b1f8474c052a8662881295c38d0be3",
          "block": {
            "time": 1724255932
          }
        }
      },
      {
        "id": 777,
        "action": "transfer",
        "bid_amount": null,
        "transaction": {
          "id": 981,
          "txid": "2a9b009c58ea36cf43de4eb8db68e291f6d2e3914f8b1b42a9577ec868d3fb09",
          "block": {
            "time": 1725118410
          }
        }
      }
    ]
  },
  {
    "id": 246,
    "name": "@carbon",
    "nameSha256": "5f1b01fc178120829dbc29b0d67b50d5b756f46d257f8e731dceeda8aa5ecbc7",
    "status": "registered",
    "bid_amount": 1000,
    "claimHeight": 42481,
    "spacesHistoryId": 868,
    "createdAt": "2024-10-02T20:52:22.852Z",
    "updatedAt": "2024-10-02T20:52:34.413Z",
    "rank": "100",
    "history": [
      {
        "id": 589,
        "action": "bid",
        "bid_amount": 1000,
        "transaction": {
          "id": 780,
          "txid": "eb3e2804d4a9a80cc619b3abc62af818964de5113fc85ae649404825f7788702",
          "block": {
            "time": 1724249541
          }
        }
      },
      {
        "id": 651,
        "action": "rollout",
        "bid_amount": null,
        "transaction": {
          "id": 838,
          "txid": "a13b8ed005f9abfc95498f1ad20d89b3c0e8908f3698dde0d334effa39b5a55d",
          "block": {
            "time": 1724530590
          }
        }
      },
      {
        "id": 868,
        "action": "transfer",
        "bid_amount": null,
        "transaction": {
          "id": 1085,
          "txid": "a26a1bd383d2bdda3e7809b83aef0e849866a02e6a4f4e307b1b018c04dfd48a",
          "block": {
            "time": 1725541244
          }
        }
      }
    ]
  },
  {
    "id": 233,
    "name": "@impervious",
    "nameSha256": "642986fcece29554350571dc918c5c6829834dce959b03f67645348c753e0098",
    "status": "registered",
    "bid_amount": 1000,
    "claimHeight": 41761,
    "spacesHistoryId": 721,
    "createdAt": "2024-10-02T20:52:20.865Z",
    "updatedAt": "2024-10-02T20:52:29.562Z",
    "rank": "101",
    "history": [
      {
        "id": 551,
        "action": "bid",
        "bid_amount": 1000,
        "transaction": {
          "id": 743,
          "txid": "d2f5f850a35659c3c25b1524f196796b37cd6a19abb6e0cbcef9eb373440a06a",
          "block": {
            "time": 1724033718
          }
        }
      },
      {
        "id": 555,
        "action": "rollout",
        "bid_amount": null,
        "transaction": {
          "id": 750,
          "txid": "ba0c795e2fad7da5562a80ebfb4909d27eb2c7e8809f9c79becc339272845979",
          "block": {
            "time": 1724077177
          }
        }
      },
      {
        "id": 721,
        "action": "transfer",
        "bid_amount": null,
        "transaction": {
          "id": 934,
          "txid": "420c74f3985d060bb37fce19be95e8dae730b86b92fd5b7640d8316bf260772c",
          "block": {
            "time": 1724985490
          }
        }
      }
    ]
  },
  {
    "id": 395,
    "name": "@mytest4",
    "nameSha256": "648b9c2ec6d9f880fca48c7631d1787dc6311209f7092f23ed42fafed95e4b76",
    "status": "auction",
    "bid_amount": 1000,
    "claimHeight": 52417,
    "spacesHistoryId": 1085,
    "createdAt": "2024-10-19T12:42:00.206Z",
    "updatedAt": "2024-10-20T05:45:00.521Z",
    "rank": "102",
    "history": [
      {
        "id": 1069,
        "action": "bid",
        "bid_amount": 1000,
        "transaction": {
          "id": 1397,
          "txid": "8bc518e50ce310d29a4edb45c248bcce8845137790f60115e062b24064a48126",
          "block": {
            "time": 1729341684
          }
        }
      },
      {
        "id": 1085,
        "action": "rollout",
        "bid_amount": null,
        "transaction": {
          "id": 1416,
          "txid": "72cc2548c188250668d98cdd0e48b3333a01ebc33d305a4f5236423ca62b800f",
          "block": {
            "time": 1729403090
          }
        }
      }
    ]
  },
  {
    "id": 230,
    "name": "@dog",
    "nameSha256": "6765464945a746725fe3ac4cdd78eb0468c6dda9006eb0e02116244cfb31fe0e",
    "status": "registered",
    "bid_amount": 1000,
    "claimHeight": 41761,
    "spacesHistoryId": 739,
    "createdAt": "2024-10-02T20:52:20.865Z",
    "updatedAt": "2024-10-02T20:52:29.635Z",
    "rank": "103",
    "history": [
      {
        "id": 548,
        "action": "bid",
        "bid_amount": 1000,
        "transaction": {
          "id": 737,
          "txid": "5d380d2b210705420a08725374a6690b88f789edf7c01d725af5b0620b8efc8e",
          "block": {
            "time": 1724033718
          }
        }
      },
      {
        "id": 564,
        "action": "rollout",
        "bid_amount": null,
        "transaction": {
          "id": 750,
          "txid": "ba0c795e2fad7da5562a80ebfb4909d27eb2c7e8809f9c79becc339272845979",
          "block": {
            "time": 1724077177
          }
        }
      },
      {
        "id": 739,
        "action": "transfer",
        "bid_amount": null,
        "transaction": {
          "id": 955,
          "txid": "904f39e121b43dbed723faa5f28c30860ad222e1d4e5d55fcc18bdaf13ba5f26",
          "block": {
            "time": 1724987894
          }
        }
      }
    ]
  },
  {
    "id": 283,
    "name": "@min",
    "nameSha256": "67a64370a1ccd604de62baea18d566f11ac08f061c3aa0e226d5ec46a49fbba0",
    "status": "registered",
    "bid_amount": 1000,
    "claimHeight": 42769,
    "spacesHistoryId": 958,
    "createdAt": "2024-10-02T20:52:26.446Z",
    "updatedAt": "2024-10-07T14:56:00.373Z",
    "rank": "104",
    "history": [
      {
        "id": 674,
        "action": "bid",
        "bid_amount": 1000,
        "transaction": {
          "id": 863,
          "txid": "6b12cf63d5521ddc5db11b57f8caa48ed4221d3114ba5b3f9f3bbff351504e0f",
          "block": {
            "time": 1724646033
          }
        }
      },
      {
        "id": 680,
        "action": "rollout",
        "bid_amount": null,
        "transaction": {
          "id": 870,
          "txid": "b9fe9b1a38d89a648ef6296bf54ae8514dcbbaaf4c38ac0b3dc0a3698cf45690",
          "block": {
            "time": 1724752162
          }
        }
      },
      {
        "id": 958,
        "action": "transfer",
        "bid_amount": null,
        "transaction": {
          "id": 1283,
          "txid": "0927dfbc6057b34dd3f057b56f634b54608c0c03dc048f02add7b41be500386e",
          "block": {
            "time": 1728315456
          }
        }
      }
    ]
  },
  {
    "id": 310,
    "name": "@nostrops",
    "nameSha256": "68b3085ba39bd6526d5a653c1a5e60390f977042ab30ce1f35a5ff44be8710e6",
    "status": "registered",
    "bid_amount": 1000,
    "claimHeight": 43489,
    "spacesHistoryId": 905,
    "createdAt": "2024-10-02T20:52:30.415Z",
    "updatedAt": "2024-10-02T20:52:40.595Z",
    "rank": "105",
    "history": [
      {
        "id": 755,
        "action": "bid",
        "bid_amount": 1000,
        "transaction": {
          "id": 968,
          "txid": "6412c56e94b72ad0f3625334e33f8705da1e2d2ea92ff0f6f1edbde9ac607819",
          "block": {
            "time": 1725037236
          }
        }
      },
      {
        "id": 769,
        "action": "rollout",
        "bid_amount": null,
        "transaction": {
          "id": 980,
          "txid": "a597bd6da3574cba043c317748ecab5bd64534c5daffa78a5e7f8ac0e7403bd9",
          "block": {
            "time": 1725089125
          }
        }
      },
      {
        "id": 905,
        "action": "transfer",
        "bid_amount": null,
        "transaction": {
          "id": 1176,
          "txid": "89abe76a4f1ccc1445deb7c645ff93f62ae130d317cb4af7a63d4b403abe334a",
          "block": {
            "time": 1725917442
          }
        }
      }
    ]
  },
  {
    "id": 284,
    "name": "@be",
    "nameSha256": "6902c45c600c949ce222bbc9a0de01e5bdca32d062de81840aa2bdb2e10f6844",
    "status": "registered",
    "bid_amount": 1000,
    "claimHeight": 42769,
    "spacesHistoryId": 953,
    "createdAt": "2024-10-02T20:52:26.446Z",
    "updatedAt": "2024-10-07T14:56:00.373Z",
    "rank": "106",
    "history": [
      {
        "id": 675,
        "action": "bid",
        "bid_amount": 1000,
        "transaction": {
          "id": 865,
          "txid": "5c28389edf8da428114a99d9bea791997452948fb906bfe3b9eacae171dce1ca",
          "block": {
            "time": 1724646033
          }
        }
      },
      {
        "id": 682,
        "action": "rollout",
        "bid_amount": null,
        "transaction": {
          "id": 870,
          "txid": "b9fe9b1a38d89a648ef6296bf54ae8514dcbbaaf4c38ac0b3dc0a3698cf45690",
          "block": {
            "time": 1724752162
          }
        }
      },
      {
        "id": 953,
        "action": "transfer",
        "bid_amount": null,
        "transaction": {
          "id": 1278,
          "txid": "79247173bafea2fe29feeb2eb6e6ee6ee1c8d21c052d2b31e6f9bbb5a7f12772",
          "block": {
            "time": 1728315456
          }
        }
      }
    ]
  },
  {
    "id": 372,
    "name": "@pin",
    "nameSha256": "6985fce307dce3089358f253d1d53e678217a9d37334076b9ba5c1971d567acf",
    "status": "auction",
    "bid_amount": 1000,
    "claimHeight": 51121,
    "spacesHistoryId": 1061,
    "createdAt": "2024-10-08T15:51:00.726Z",
    "updatedAt": "2024-10-11T01:13:00.785Z",
    "rank": "107",
    "history": [
      {
        "id": 1012,
        "action": "bid",
        "bid_amount": 1000,
        "transaction": {
          "id": 1339,
          "txid": "9286c9a0e24031d2ffc8b5598cee2ce9cc76342e78a49597c40244cfc22603e4",
          "block": {
            "time": 1728409829
          }
        }
      },
      {
        "id": 1061,
        "action": "rollout",
        "bid_amount": null,
        "transaction": {
          "id": 1377,
          "txid": "44f0b479f7c1e1b4f6120e26b958b2e0a29a336ace75c6f06f763f3ab9627361",
          "block": {
            "time": 1728613773
          }
        }
      }
    ]
  },
  {
    "id": 393,
    "name": "@mytest6",
    "nameSha256": "69b5d402fdac06bef7a0b743ce8cc3f096084196ddf75236372767a2f34aa96d",
    "status": "auction",
    "bid_amount": 1000,
    "claimHeight": 52417,
    "spacesHistoryId": 1080,
    "createdAt": "2024-10-19T12:42:00.206Z",
    "updatedAt": "2024-10-20T05:45:00.521Z",
    "rank": "108",
    "history": [
      {
        "id": 1067,
        "action": "bid",
        "bid_amount": 1000,
        "transaction": {
          "id": 1393,
          "txid": "07201f9905bf96733a43b60339177688c960c1b6e05b5bfd2c0dd6f08fd4f48e",
          "block": {
            "time": 1729341684
          }
        }
      },
      {
        "id": 1080,
        "action": "rollout",
        "bid_amount": null,
        "transaction": {
          "id": 1416,
          "txid": "72cc2548c188250668d98cdd0e48b3333a01ebc33d305a4f5236423ca62b800f",
          "block": {
            "time": 1729403090
          }
        }
      }
    ]
  },
  {
    "id": 386,
    "name": "@city",
    "nameSha256": "6b712c0788306804c11528567ae1950b762b20fa37656d235cd7ec87a9f4fc03",
    "status": "auction",
    "bid_amount": 1000,
    "claimHeight": 50833,
    "spacesHistoryId": 1041,
    "createdAt": "2024-10-08T16:32:00.211Z",
    "updatedAt": "2024-10-10T05:23:00.074Z",
    "rank": "109",
    "history": [
      {
        "id": 1026,
        "action": "bid",
        "bid_amount": 1000,
        "transaction": {
          "id": 1367,
          "txid": "3cf6ea96a1333615c21d31b0e368451815379e4188fea13800c88011a0a70ae1",
          "block": {
            "time": 1728412271
          }
        }
      },
      {
        "id": 1041,
        "action": "rollout",
        "bid_amount": null,
        "transaction": {
          "id": 1375,
          "txid": "62fc9c12df7532ea2e099642b0e3803c00ba3abd96ea9e7e21c85e8e5552cabb",
          "block": {
            "time": 1728544952
          }
        }
      }
    ]
  },
  {
    "id": 224,
    "name": "@blue",
    "nameSha256": "6dd2287e8df1bf4e56b91cdc133597b00cb667a24c90c51590cb20be219f3ebb",
    "status": "registered",
    "bid_amount": 1000,
    "claimHeight": 41617,
    "spacesHistoryId": 731,
    "createdAt": "2024-10-02T20:52:20.032Z",
    "updatedAt": "2024-10-02T20:52:29.562Z",
    "rank": "110",
    "history": [
      {
        "id": 532,
        "action": "bid",
        "bid_amount": 1000,
        "transaction": {
          "id": 724,
          "txid": "d46a5cf5c25aee888f859705c3fd1016981d173c18e9738803940e0f01b2188f",
          "block": {
            "time": 1723952686
          }
        }
      },
      {
        "id": 539,
        "action": "rollout",
        "bid_amount": null,
        "transaction": {
          "id": 729,
          "txid": "ed5fbad05e3c895cb4e183b1df94ec6928bad102c4ad689f7cc339bac8def4de",
          "block": {
            "time": 1723994427
          }
        }
      },
      {
        "id": 731,
        "action": "transfer",
        "bid_amount": null,
        "transaction": {
          "id": 944,
          "txid": "7b6f0ba82f3e8939ce6ef80d6eb5d9921d12ede18b89f15fe5c3f6f43123959c",
          "block": {
            "time": 1724985490
          }
        }
      }
    ]
  },
  {
    "id": 235,
    "name": "@mississippi",
    "nameSha256": "6f6a1640ba0d84121176ea8c52956752b413c74cea5c78fc251bdc5b95e36c7b",
    "status": "registered",
    "bid_amount": 1000,
    "claimHeight": 41761,
    "spacesHistoryId": 954,
    "createdAt": "2024-10-02T20:52:20.865Z",
    "updatedAt": "2024-10-07T14:56:00.373Z",
    "rank": "111",
    "history": [
      {
        "id": 553,
        "action": "bid",
        "bid_amount": 1000,
        "transaction": {
          "id": 747,
          "txid": "74be5bf9d8a0101a12fe7785125462d02d728be78331986201a5d4e99bc8e58f",
          "block": {
            "time": 1724033718
          }
        }
      },
      {
        "id": 556,
        "action": "rollout",
        "bid_amount": null,
        "transaction": {
          "id": 750,
          "txid": "ba0c795e2fad7da5562a80ebfb4909d27eb2c7e8809f9c79becc339272845979",
          "block": {
            "time": 1724077177
          }
        }
      },
      {
        "id": 954,
        "action": "transfer",
        "bid_amount": null,
        "transaction": {
          "id": 1279,
          "txid": "87e480f879bfd19bcda5e51686ec5ec7187eb7dedb481c7c80f92764cc7f94c3",
          "block": {
            "time": 1728315456
          }
        }
      }
    ]
  },
  {
    "id": 204,
    "name": "@buy",
    "nameSha256": "70563d8875fc227bd8e3f5edd76ca19ca01b6ab3669ee4ae2c97ce535d800974",
    "status": "registered",
    "bid_amount": 1000,
    "claimHeight": 41473,
    "spacesHistoryId": 728,
    "createdAt": "2024-10-02T20:52:19.508Z",
    "updatedAt": "2024-10-02T20:52:29.562Z",
    "rank": "112",
    "history": [
      {
        "id": 502,
        "action": "bid",
        "bid_amount": 1000,
        "transaction": {
          "id": 683,
          "txid": "5e8ce0880c2032f83cd1e92f3c78d5ebef601a2e640beed778199ab0ea59c2d7",
          "block": {
            "time": 1723909697
          }
        }
      },
      {
        "id": 513,
        "action": "rollout",
        "bid_amount": null,
        "transaction": {
          "id": 696,
          "txid": "748b434660b2026ece4275ad25e730a27321656b638c4e3929f65dcff689d1d2",
          "block": {
            "time": 1723926719
          }
        }
      },
      {
        "id": 728,
        "action": "transfer",
        "bid_amount": null,
        "transaction": {
          "id": 941,
          "txid": "292d027719bdb2f17d2f555cd9ec8eda6be723368df593142b7353ec7489072d",
          "block": {
            "time": 1724985490
          }
        }
      }
    ]
  },
  {
    "id": 231,
    "name": "@z",
    "nameSha256": "7152071194055870cd1f38344a48e6f2776045383eefa65dcd7b2374a2bed439",
    "status": "registered",
    "bid_amount": 1000,
    "claimHeight": 41761,
    "spacesHistoryId": 699,
    "createdAt": "2024-10-02T20:52:20.865Z",
    "updatedAt": "2024-10-02T20:52:29.427Z",
    "rank": "113",
    "history": [
      {
        "id": 549,
        "action": "bid",
        "bid_amount": 1000,
        "transaction": {
          "id": 739,
          "txid": "283e835c965b8e933c7037a4458f4a21f708ecdbf7b6820ccb483dea1dd7e59b",
          "block": {
            "time": 1724033718
          }
        }
      },
      {
        "id": 557,
        "action": "rollout",
        "bid_amount": null,
        "transaction": {
          "id": 750,
          "txid": "ba0c795e2fad7da5562a80ebfb4909d27eb2c7e8809f9c79becc339272845979",
          "block": {
            "time": 1724077177
          }
        }
      },
      {
        "id": 699,
        "action": "transfer",
        "bid_amount": null,
        "transaction": {
          "id": 896,
          "txid": "1f26b7a8941380b6f8f58400def77415e4006360d6b40106a9bd70d52c4fda70",
          "block": {
            "time": 1724985721
          }
        }
      }
    ]
  },
  {
    "id": 371,
    "name": "@fm",
    "nameSha256": "715f7688ec845b6557ad5dcde47c29441d89918490aeee934e6848783cc0caff",
    "status": "auction",
    "bid_amount": 1000,
    "claimHeight": 50689,
    "spacesHistoryId": 1031,
    "createdAt": "2024-10-08T15:51:00.726Z",
    "updatedAt": "2024-10-09T01:13:00.537Z",
    "rank": "114",
    "history": [
      {
        "id": 1011,
        "action": "bid",
        "bid_amount": 1000,
        "transaction": {
          "id": 1338,
          "txid": "70b63eac3fa8347be4db6c078ababac3717594498af31fe73b6e93dd99ed73c9",
          "block": {
            "time": 1728409829
          }
        }
      },
      {
        "id": 1031,
        "action": "rollout",
        "bid_amount": null,
        "transaction": {
          "id": 1374,
          "txid": "01797a10e75cc91a87eccf99e01a59f203c9a6f720b9d30122590b355bd5da10",
          "block": {
            "time": 1728441324
          }
        }
      }
    ]
  },
  {
    "id": 322,
    "name": "@edit",
    "nameSha256": "7217d597537162f054e9ad02b96fdc30df2b03e7a910d255cc29eb835f590474",
    "status": "registered",
    "bid_amount": 1000,
    "claimHeight": 43777,
    "spacesHistoryId": 987,
    "createdAt": "2024-10-02T20:52:31.388Z",
    "updatedAt": "2024-10-07T15:39:00.891Z",
    "rank": "115",
    "history": [
      {
        "id": 798,
        "action": "bid",
        "bid_amount": 1000,
        "transaction": {
          "id": 1015,
          "txid": "0882cf0cdf61e353b5136747eace379d676a706803470fdc1ef80c684b7c43f0",
          "block": {
            "time": 1725121917
          }
        }
      },
      {
        "id": 827,
        "action": "rollout",
        "bid_amount": null,
        "transaction": {
          "id": 1043,
          "txid": "6d3e3777b3aaef22cbe5374c1dd946f59fff9821e182ee09bec3ae5a3a855205",
          "block": {
            "time": 1725381834
          }
        }
      },
      {
        "id": 987,
        "action": "transfer",
        "bid_amount": null,
        "transaction": {
          "id": 1312,
          "txid": "f008f86e348be94462402c5dee2227cb07a925e4843bb6787a8ed5afc9579e4c",
          "block": {
            "time": 1728322721
          }
        }
      }
    ]
  },
  {
    "id": 391,
    "name": "@mytest3",
    "nameSha256": "725e064917780794e16579fa2c5c14f58d22bb1b053fe75fd6459d8925f1d47c",
    "status": "pre-auction",
    "bid_amount": 1000,
    "claimHeight": null,
    "spacesHistoryId": 1065,
    "createdAt": "2024-10-19T12:42:00.206Z",
    "updatedAt": "2024-10-19T12:42:00.206Z",
    "rank": "116",
    "history": [
      {
        "id": 1065,
        "action": "bid",
        "bid_amount": 1000,
        "transaction": {
          "id": 1389,
          "txid": "f65cc9de6ad1753d3ac7ca7bbe32428c4662457a5fc9db515171493d4646857c",
          "block": {
            "time": 1729341684
          }
        }
      }
    ]
  },
  {
    "id": 350,
    "name": "@cheese",
    "nameSha256": "739fd9614d5e5608ac478d1c67b49eb0dffd06df4a11bfc3a98b15fd44c8c20f",
    "status": "auction",
    "bid_amount": 1000,
    "claimHeight": 50833,
    "spacesHistoryId": 1048,
    "createdAt": "2024-10-07T14:42:00.815Z",
    "updatedAt": "2024-10-10T05:23:00.074Z",
    "rank": "117",
    "history": [
      {
        "id": 941,
        "action": "bid",
        "bid_amount": 1000,
        "transaction": {
          "id": 1254,
          "txid": "639eb3dc5debf1c641a503d1908b4467d53e043dcc80cea67cab020be2c45d0b",
          "block": {
            "time": 1728319307
          }
        }
      },
      {
        "id": 1048,
        "action": "rollout",
        "bid_amount": null,
        "transaction": {
          "id": 1375,
          "txid": "62fc9c12df7532ea2e099642b0e3803c00ba3abd96ea9e7e21c85e8e5552cabb",
          "block": {
            "time": 1728544952
          }
        }
      }
    ]
  },
  {
    "id": 277,
    "name": "@file",
    "nameSha256": "7439b7d099e04c5769e752cea6fe3b675728908671cd6fc1767fa76bcd9b4a2d",
    "status": "registered",
    "bid_amount": 1000,
    "claimHeight": 42625,
    "spacesHistoryId": 886,
    "createdAt": "2024-10-02T20:52:26.048Z",
    "updatedAt": "2024-10-02T20:52:34.413Z",
    "rank": "118",
    "history": [
      {
        "id": 660,
        "action": "bid",
        "bid_amount": 1000,
        "transaction": {
          "id": 849,
          "txid": "3c9eb43d15ac2beea8f40a2e79d7c58c0198837eb7e5921db340d0ccd0a14d8c",
          "block": {
            "time": 1724598174
          }
        }
      },
      {
        "id": 668,
        "action": "rollout",
        "bid_amount": null,
        "transaction": {
          "id": 856,
          "txid": "efcf1152559ca55143c0602c153e383dbcddb912011f67a68ccd389e9b808c19",
          "block": {
            "time": 1724640859
          }
        }
      },
      {
        "id": 886,
        "action": "transfer",
        "bid_amount": null,
        "transaction": {
          "id": 1148,
          "txid": "b4a8591fc4db6a29b9d3d31ccf8922d98c3e780561aed9ca8e8cff743ab66ae6",
          "block": {
            "time": 1725541244
          }
        }
      }
    ]
  },
  {
    "id": 320,
    "name": "@bro",
    "nameSha256": "74b4aae9e2c32cd0d85309437bf6d55adbb05d14b03b7ef0d2ac0d61301af9ff",
    "status": "registered",
    "bid_amount": 1000,
    "claimHeight": 43633,
    "spacesHistoryId": 978,
    "createdAt": "2024-10-02T20:52:31.388Z",
    "updatedAt": "2024-10-07T15:39:00.891Z",
    "rank": "119",
    "history": [
      {
        "id": 796,
        "action": "bid",
        "bid_amount": 1000,
        "transaction": {
          "id": 1011,
          "txid": "81e404780ad29905f63ae3227e69896efaa783e020f1b46eda19e0ba7cbf3a74",
          "block": {
            "time": 1725121917
          }
        }
      },
      {
        "id": 812,
        "action": "rollout",
        "bid_amount": null,
        "transaction": {
          "id": 1041,
          "txid": "df17732535dbf2580795415b751e95e2b94633d0ee623f2883458e1587d5936f",
          "block": {
            "time": 1725168709
          }
        }
      },
      {
        "id": 978,
        "action": "transfer",
        "bid_amount": null,
        "transaction": {
          "id": 1303,
          "txid": "5191c23253e19edf8799bd03e9296838a6264556654fdd93f71241d3338c7b57",
          "block": {
            "time": 1728322721
          }
        }
      }
    ]
  },
  {
    "id": 278,
    "name": "@tags",
    "nameSha256": "768ce85186a204d802bad2aa8e4f780bc733cda006733977f0cd05a4a1e56f6a",
    "status": "registered",
    "bid_amount": 1000,
    "claimHeight": 42625,
    "spacesHistoryId": 890,
    "createdAt": "2024-10-02T20:52:26.048Z",
    "updatedAt": "2024-10-02T20:52:34.413Z",
    "rank": "120",
    "history": [
      {
        "id": 661,
        "action": "bid",
        "bid_amount": 1000,
        "transaction": {
          "id": 850,
          "txid": "51a322a887d4cd50436b12c252221d47f628f50d333718fc0a78429fa4b58db1",
          "block": {
            "time": 1724598174
          }
        }
      },
      {
        "id": 669,
        "action": "rollout",
        "bid_amount": null,
        "transaction": {
          "id": 856,
          "txid": "efcf1152559ca55143c0602c153e383dbcddb912011f67a68ccd389e9b808c19",
          "block": {
            "time": 1724640859
          }
        }
      },
      {
        "id": 890,
        "action": "transfer",
        "bid_amount": null,
        "transaction": {
          "id": 1152,
          "txid": "9814ce00f2590d864f2c6a325a8e93c9e8e30d30513940a0fff5511de8a3c51c",
          "block": {
            "time": 1725541244
          }
        }
      }
    ]
  },
  {
    "id": 300,
    "name": "@catalog",
    "nameSha256": "76d93d71ddd44ec1e38e89cd5f9ddaa67a56e7efc0f5bad7987111087cdadb59",
    "status": "registered",
    "bid_amount": 1000,
    "claimHeight": 43345,
    "spacesHistoryId": 961,
    "createdAt": "2024-10-02T20:52:29.500Z",
    "updatedAt": "2024-10-07T14:59:00.459Z",
    "rank": "121",
    "history": [
      {
        "id": 716,
        "action": "bid",
        "bid_amount": 1000,
        "transaction": {
          "id": 926,
          "txid": "be58117f349ce317b29cb14062c815e7f83fcf9a4c75e421faf0d972e831cde2",
          "block": {
            "time": 1724984665
          }
        }
      },
      {
        "id": 749,
        "action": "rollout",
        "bid_amount": null,
        "transaction": {
          "id": 966,
          "txid": "4e0e6fa469456a7030468269b8fd988e32c8f5cc888ce00120fa36a92d787cd0",
          "block": {
            "time": 1725027352
          }
        }
      },
      {
        "id": 961,
        "action": "transfer",
        "bid_amount": null,
        "transaction": {
          "id": 1286,
          "txid": "af4e08a0807fa47b09157d38b888f888437f132d1d910b5c2d3f05ff3958b55c",
          "block": {
            "time": 1728320319
          }
        }
      }
    ]
  },
  {
    "id": 328,
    "name": "@c",
    "nameSha256": "7718acad7df1b535661aeea6ee93ad6ee4a72f012cfc412c0b381ecdde22f39c",
    "status": "registered",
    "bid_amount": 1000,
    "claimHeight": 43777,
    "spacesHistoryId": 917,
    "createdAt": "2024-10-02T20:52:31.758Z",
    "updatedAt": "2024-10-07T14:22:00.091Z",
    "rank": "122",
    "history": [
      {
        "id": 804,
        "action": "bid",
        "bid_amount": 1000,
        "transaction": {
          "id": 1028,
          "txid": "1ebc3e54159dd9657bddd562ed3596ef11939872aa218d094b6340a7c545e851",
          "block": {
            "time": 1725154762
          }
        }
      },
      {
        "id": 823,
        "action": "rollout",
        "bid_amount": null,
        "transaction": {
          "id": 1043,
          "txid": "6d3e3777b3aaef22cbe5374c1dd946f59fff9821e182ee09bec3ae5a3a855205",
          "block": {
            "time": 1725381834
          }
        }
      },
      {
        "id": 917,
        "action": "transfer",
        "bid_amount": null,
        "transaction": {
          "id": 1226,
          "txid": "fb6b619c6d6886a57b658ef01c8e754f008f5838b6cf582e3e4c00696696553b",
          "block": {
            "time": 1728312983
          }
        }
      }
    ]
  },
  {
    "id": 257,
    "name": "@cook",
    "nameSha256": "792938cb282f49957bd04aeb9bbf2c1e25568ed49d0d59e0423e18d5f80c70a5",
    "status": "registered",
    "bid_amount": 1000,
    "claimHeight": 42193,
    "spacesHistoryId": 840,
    "createdAt": "2024-10-02T20:52:22.915Z",
    "updatedAt": "2024-10-02T20:52:34.112Z",
    "rank": "123",
    "history": [
      {
        "id": 600,
        "action": "bid",
        "bid_amount": 1000,
        "transaction": {
          "id": 802,
          "txid": "ce1702ee2d944baf330a528fbd3b7adf07c08a7a622627e203ab002076d0586b",
          "block": {
            "time": 1724251887
          }
        }
      },
      {
        "id": 626,
        "action": "rollout",
        "bid_amount": null,
        "transaction": {
          "id": 816,
          "txid": "7af1e824358c2644ef73e4e1ebde8d2fe27ed5ee4af29dc068bc723080ccbb1d",
          "block": {
            "time": 1724329893
          }
        }
      },
      {
        "id": 840,
        "action": "transfer",
        "bid_amount": null,
        "transaction": {
          "id": 1047,
          "txid": "047f0730e8ce152adcb40d00fcf95a450e18756a0ea16fafc14321ef4e5a211d",
          "block": {
            "time": 1725520217
          }
        }
      }
    ]
  },
  {
    "id": 383,
    "name": "@911",
    "nameSha256": "7b93ffdef21415d633f5ab252274ae3ed1b27ca7018a398abad591c6a4ad9419",
    "status": "auction",
    "bid_amount": 1000,
    "claimHeight": 50689,
    "spacesHistoryId": 1030,
    "createdAt": "2024-10-08T16:32:00.211Z",
    "updatedAt": "2024-10-09T01:13:00.537Z",
    "rank": "124",
    "history": [
      {
        "id": 1023,
        "action": "bid",
        "bid_amount": 1000,
        "transaction": {
          "id": 1361,
          "txid": "129209cc603725cc05b05933304c67476257d60a13fde82063b6d56a03d85894",
          "block": {
            "time": 1728412271
          }
        }
      },
      {
        "id": 1030,
        "action": "rollout",
        "bid_amount": null,
        "transaction": {
          "id": 1374,
          "txid": "01797a10e75cc91a87eccf99e01a59f203c9a6f720b9d30122590b355bd5da10",
          "block": {
            "time": 1728441324
          }
        }
      }
    ]
  },
  {
    "id": 295,
    "name": "@bros",
    "nameSha256": "7debe22aa6a14a038883aa322e1eddd496856131ea52989ecc0a66d508734278",
    "status": "registered",
    "bid_amount": 1000,
    "claimHeight": 43489,
    "spacesHistoryId": 969,
    "createdAt": "2024-10-02T20:52:29.479Z",
    "updatedAt": "2024-10-07T15:39:00.891Z",
    "rank": "125",
    "history": [
      {
        "id": 711,
        "action": "bid",
        "bid_amount": 1000,
        "transaction": {
          "id": 916,
          "txid": "fc773e18e8e6d9a4ded9759b36504bacc68fc1df62115d78ab093a94e2915082",
          "block": {
            "time": 1724986924
          }
        }
      },
      {
        "id": 768,
        "action": "rollout",
        "bid_amount": null,
        "transaction": {
          "id": 980,
          "txid": "a597bd6da3574cba043c317748ecab5bd64534c5daffa78a5e7f8ac0e7403bd9",
          "block": {
            "time": 1725089125
          }
        }
      },
      {
        "id": 969,
        "action": "transfer",
        "bid_amount": null,
        "transaction": {
          "id": 1294,
          "txid": "0c1a2012c3c62ea9e474648305f917727884049356476cf0ecc19e7709e07dbc",
          "block": {
            "time": 1728322721
          }
        }
      }
    ]
  },
  {
    "id": 288,
    "name": "@bean",
    "nameSha256": "7dfd8c04877126e6139316556bbd85da7c1ab72f573876f48d99f4be14b381a3",
    "status": "registered",
    "bid_amount": 1000,
    "claimHeight": 43489,
    "spacesHistoryId": 973,
    "createdAt": "2024-10-02T20:52:29.427Z",
    "updatedAt": "2024-10-07T15:39:00.891Z",
    "rank": "126",
    "history": [
      {
        "id": 701,
        "action": "bid",
        "bid_amount": 1000,
        "transaction": {
          "id": 900,
          "txid": "30ba6a826d87182642c28cc5653fe7b6e887dcb2d4bbf2accb774a3ba8b8cfcb",
          "block": {
            "time": 1724985721
          }
        }
      },
      {
        "id": 770,
        "action": "rollout",
        "bid_amount": null,
        "transaction": {
          "id": 980,
          "txid": "a597bd6da3574cba043c317748ecab5bd64534c5daffa78a5e7f8ac0e7403bd9",
          "block": {
            "time": 1725089125
          }
        }
      },
      {
        "id": 973,
        "action": "transfer",
        "bid_amount": null,
        "transaction": {
          "id": 1298,
          "txid": "b4cfb032dae3e591c7135335779fe91bcd138eef28bd3269e3c7dd152cedc34f",
          "block": {
            "time": 1728322721
          }
        }
      }
    ]
  },
  {
    "id": 301,
    "name": "@chart",
    "nameSha256": "7e18e5f3c9641046bae1e5e549519441b8b362091b19f38d30f1f881792c7f90",
    "status": "registered",
    "bid_amount": 1000,
    "claimHeight": 43345,
    "spacesHistoryId": 967,
    "createdAt": "2024-10-02T20:52:29.500Z",
    "updatedAt": "2024-10-07T15:39:00.891Z",
    "rank": "127",
    "history": [
      {
        "id": 717,
        "action": "bid",
        "bid_amount": 1000,
        "transaction": {
          "id": 928,
          "txid": "afb0ddb7dcc5632c9988e6fc5dcc7eb6beaa3d8bd624cf3a287fbbfbef3d0c7f",
          "block": {
            "time": 1724984665
          }
        }
      },
      {
        "id": 754,
        "action": "rollout",
        "bid_amount": null,
        "transaction": {
          "id": 966,
          "txid": "4e0e6fa469456a7030468269b8fd988e32c8f5cc888ce00120fa36a92d787cd0",
          "block": {
            "time": 1725027352
          }
        }
      },
      {
        "id": 967,
        "action": "transfer",
        "bid_amount": null,
        "transaction": {
          "id": 1292,
          "txid": "d1c6b00fb84fddfee8a1c203224d08dbb885338016a4e70294e699db57145950",
          "block": {
            "time": 1728322721
          }
        }
      }
    ]
  },
  {
    "id": 390,
    "name": "@mytest2",
    "nameSha256": "7ed246a000c647618a6e4af1c47a3e72591a0631d95e8bcc8c32f1cd726bd39f",
    "status": "pre-auction",
    "bid_amount": 1000,
    "claimHeight": null,
    "spacesHistoryId": 1064,
    "createdAt": "2024-10-19T12:42:00.206Z",
    "updatedAt": "2024-10-19T12:42:00.206Z",
    "rank": "128",
    "history": [
      {
        "id": 1064,
        "action": "bid",
        "bid_amount": 1000,
        "transaction": {
          "id": 1387,
          "txid": "18508d6f13ca44f3214c1d730f901599c8e4ac53bc5ec4af617692debe4a5942",
          "block": {
            "time": 1729341684
          }
        }
      }
    ]
  },
  {
    "id": 398,
    "name": "@mytest9",
    "nameSha256": "7f5ddf61cc1add9c4f1cae4551fe8ae3e0237a5411484d97604fbdae9fe5e359",
    "status": "auction",
    "bid_amount": 1000,
    "claimHeight": 52417,
    "spacesHistoryId": 1084,
    "createdAt": "2024-10-19T12:42:00.206Z",
    "updatedAt": "2024-10-20T05:45:00.521Z",
    "rank": "129",
    "history": [
      {
        "id": 1072,
        "action": "bid",
        "bid_amount": 1000,
        "transaction": {
          "id": 1403,
          "txid": "b0624f660b802233c3fc73306c14aa98a2ae6ed132232628bfeb6dadc8266ec1",
          "block": {
            "time": 1729341684
          }
        }
      },
      {
        "id": 1084,
        "action": "rollout",
        "bid_amount": null,
        "transaction": {
          "id": 1416,
          "txid": "72cc2548c188250668d98cdd0e48b3333a01ebc33d305a4f5236423ca62b800f",
          "block": {
            "time": 1729403090
          }
        }
      }
    ]
  },
  {
    "id": 370,
    "name": "@chess",
    "nameSha256": "8017bb832c4332577a3411fa0f9fd888ab614e98894b1c31f9c3c169d669de89",
    "status": "auction",
    "bid_amount": 1000,
    "claimHeight": 50977,
    "spacesHistoryId": 1053,
    "createdAt": "2024-10-08T15:51:00.726Z",
    "updatedAt": "2024-10-10T15:40:00.396Z",
    "rank": "130",
    "history": [
      {
        "id": 1010,
        "action": "bid",
        "bid_amount": 1000,
        "transaction": {
          "id": 1337,
          "txid": "62968c1200e572e1f546f71e2253b736fa386939abf05473c17321bad9eb2bc4",
          "block": {
            "time": 1728409829
          }
        }
      },
      {
        "id": 1053,
        "action": "rollout",
        "bid_amount": null,
        "transaction": {
          "id": 1376,
          "txid": "1e46c34f547fb79f68cc297c6c5974acba4d5ad2f99297053c325f718f456a12",
          "block": {
            "time": 1728578686
          }
        }
      }
    ]
  },
  {
    "id": 276,
    "name": "@register",
    "nameSha256": "80aef92ca5f92a34b990324667f16ee5febb50ace0857c1ea38aaea362369ec0",
    "status": "registered",
    "bid_amount": 1000,
    "claimHeight": 42625,
    "spacesHistoryId": 885,
    "createdAt": "2024-10-02T20:52:26.048Z",
    "updatedAt": "2024-10-02T20:52:34.413Z",
    "rank": "131",
    "history": [
      {
        "id": 659,
        "action": "bid",
        "bid_amount": 1000,
        "transaction": {
          "id": 847,
          "txid": "23cbc9839db2b25ab8e398fd8efea6e1fceef62c06d3b0d642b895a58b95d450",
          "block": {
            "time": 1724598174
          }
        }
      },
      {
        "id": 667,
        "action": "rollout",
        "bid_amount": null,
        "transaction": {
          "id": 856,
          "txid": "efcf1152559ca55143c0602c153e383dbcddb912011f67a68ccd389e9b808c19",
          "block": {
            "time": 1724640859
          }
        }
      },
      {
        "id": 885,
        "action": "transfer",
        "bid_amount": null,
        "transaction": {
          "id": 1147,
          "txid": "069037e20fb4ab1dfa5be2458dd3c002106e8cb2e861fe2e7582c29393ca4f84",
          "block": {
            "time": 1725541244
          }
        }
      }
    ]
  },
  {
    "id": 346,
    "name": "@burger",
    "nameSha256": "810f0ecd865d3757436efe71610124698a6a042e1e7d405ab32f61403a129bb8",
    "status": "auction",
    "bid_amount": 1000,
    "claimHeight": 50545,
    "spacesHistoryId": 992,
    "createdAt": "2024-10-07T14:21:01.025Z",
    "updatedAt": "2024-10-08T04:29:00.197Z",
    "rank": "132",
    "history": [
      {
        "id": 913,
        "action": "bid",
        "bid_amount": 1000,
        "transaction": {
          "id": 1221,
          "txid": "9c20efdfa2981dbdadd02cc4d0edb20780ffeacab828cd30c97f4bd84e4be6f5",
          "block": {
            "time": 1728318031
          }
        }
      },
      {
        "id": 992,
        "action": "rollout",
        "bid_amount": null,
        "transaction": {
          "id": 1313,
          "txid": "dfc5fedf742b14271ccda5c80e42d7cf649a00f21ee26e2ce755434f02d2e4c4",
          "block": {
            "time": 1728368724
          }
        }
      }
    ]
  },
  {
    "id": 229,
    "name": "@mint",
    "nameSha256": "813fa54d919fd3790776ed9750f5975d5ed9c43c7d0928d683669bfa219f4ce8",
    "status": "registered",
    "bid_amount": 1000,
    "claimHeight": 41761,
    "spacesHistoryId": 706,
    "createdAt": "2024-10-02T20:52:20.865Z",
    "updatedAt": "2024-10-02T20:52:29.427Z",
    "rank": "133",
    "history": [
      {
        "id": 547,
        "action": "bid",
        "bid_amount": 1000,
        "transaction": {
          "id": 735,
          "txid": "f1cae65b87d890236505816bc7ca6ba1d02a79072b42d5f97940d74aa239931d",
          "block": {
            "time": 1724033718
          }
        }
      },
      {
        "id": 558,
        "action": "rollout",
        "bid_amount": null,
        "transaction": {
          "id": 750,
          "txid": "ba0c795e2fad7da5562a80ebfb4909d27eb2c7e8809f9c79becc339272845979",
          "block": {
            "time": 1724077177
          }
        }
      },
      {
        "id": 706,
        "action": "transfer",
        "bid_amount": null,
        "transaction": {
          "id": 908,
          "txid": "b9194c92779f9035574a4b502495d142b58937ca5f373aeb01b2622620e328bb",
          "block": {
            "time": 1724985721
          }
        }
      }
    ]
  },
  {
    "id": 388,
    "name": "@us",
    "nameSha256": "82680d75ca9385ec1f43e575c5f8d13ee3c58a55ed43ef6291ab9e4b0ea77609",
    "status": "auction",
    "bid_amount": 1000,
    "claimHeight": 50689,
    "spacesHistoryId": 1036,
    "createdAt": "2024-10-08T16:32:00.211Z",
    "updatedAt": "2024-10-09T01:13:00.537Z",
    "rank": "134",
    "history": [
      {
        "id": 1028,
        "action": "bid",
        "bid_amount": 1000,
        "transaction": {
          "id": 1371,
          "txid": "9a3aecde197adc1a90efd75cfa9cdd166cd6d6155247983a0ce2b0cea6724a6d",
          "block": {
            "time": 1728412271
          }
        }
      },
      {
        "id": 1036,
        "action": "rollout",
        "bid_amount": null,
        "transaction": {
          "id": 1374,
          "txid": "01797a10e75cc91a87eccf99e01a59f203c9a6f720b9d30122590b355bd5da10",
          "block": {
            "time": 1728441324
          }
        }
      }
    ]
  },
  {
    "id": 353,
    "name": "@candy",
    "nameSha256": "8393e113779ffef2531ffddfbdb1ea0798e86d293634ac59ce0545e9e20b630a",
    "status": "auction",
    "bid_amount": 1000,
    "claimHeight": 50545,
    "spacesHistoryId": 994,
    "createdAt": "2024-10-07T14:42:00.815Z",
    "updatedAt": "2024-10-08T04:29:00.197Z",
    "rank": "135",
    "history": [
      {
        "id": 944,
        "action": "bid",
        "bid_amount": 1000,
        "transaction": {
          "id": 1260,
          "txid": "c5cce5ce3ddb050cde10d92e2a8059dcfc83e0191fab306e2ed7d957eb29ddaf",
          "block": {
            "time": 1728319307
          }
        }
      },
      {
        "id": 994,
        "action": "rollout",
        "bid_amount": null,
        "transaction": {
          "id": 1313,
          "txid": "dfc5fedf742b14271ccda5c80e42d7cf649a00f21ee26e2ce755434f02d2e4c4",
          "block": {
            "time": 1728368724
          }
        }
      }
    ]
  },
  {
    "id": 403,
    "name": "@mytest13",
    "nameSha256": "84594380657271bcdd685b2ed7174a1a69e60ecba66679332782df66bc1acd4b",
    "status": "auction",
    "bid_amount": 1000,
    "claimHeight": 52417,
    "spacesHistoryId": 1087,
    "createdAt": "2024-10-19T12:42:00.206Z",
    "updatedAt": "2024-10-20T05:45:00.521Z",
    "rank": "136",
    "history": [
      {
        "id": 1077,
        "action": "bid",
        "bid_amount": 1000,
        "transaction": {
          "id": 1413,
          "txid": "1a62710bc24feb30b1b07ca327a01d31da3b4d440edac463d4201751a6c8900c",
          "block": {
            "time": 1729341684
          }
        }
      },
      {
        "id": 1087,
        "action": "rollout",
        "bid_amount": null,
        "transaction": {
          "id": 1416,
          "txid": "72cc2548c188250668d98cdd0e48b3333a01ebc33d305a4f5236423ca62b800f",
          "block": {
            "time": 1729403090
          }
        }
      }
    ]
  },
  {
    "id": 263,
    "name": "@email",
    "nameSha256": "8738e67249ba943044a5f0f3c45ee7b0f56f31e694ab17e291e526af6d04d968",
    "status": "registered",
    "bid_amount": 1000,
    "claimHeight": 42193,
    "spacesHistoryId": 847,
    "createdAt": "2024-10-02T20:52:23.116Z",
    "updatedAt": "2024-10-02T20:52:34.112Z",
    "rank": "137",
    "history": [
      {
        "id": 616,
        "action": "bid",
        "bid_amount": 1000,
        "transaction": {
          "id": 815,
          "txid": "592caae671092978bae58b859aa2368a562e4666b52c0837149c04c85d4dd710",
          "block": {
            "time": 1724265829
          }
        }
      },
      {
        "id": 623,
        "action": "rollout",
        "bid_amount": null,
        "transaction": {
          "id": 816,
          "txid": "7af1e824358c2644ef73e4e1ebde8d2fe27ed5ee4af29dc068bc723080ccbb1d",
          "block": {
            "time": 1724329893
          }
        }
      },
      {
        "id": 847,
        "action": "transfer",
        "bid_amount": null,
        "transaction": {
          "id": 1054,
          "txid": "109f3aa3b33b1168d1659029597dbf67874a373d8891eb680846e88207f95875",
          "block": {
            "time": 1725520217
          }
        }
      }
    ]
  },
  {
    "id": 209,
    "name": "@1",
    "nameSha256": "8c7417322642e57a21eb81af786f8956de698e80423df737c14f6856650826e0",
    "status": "registered",
    "bid_amount": 1000,
    "claimHeight": 41905,
    "spacesHistoryId": 759,
    "createdAt": "2024-10-02T20:52:19.563Z",
    "updatedAt": "2024-10-02T20:52:30.684Z",
    "rank": "138",
    "history": [
      {
        "id": 507,
        "action": "bid",
        "bid_amount": 1000,
        "transaction": {
          "id": 694,
          "txid": "bbdb589b9c2128f02144c441ec2391724beeabdeba7d677911c90829505fbf25",
          "block": {
            "time": 1723915939
          }
        }
      },
      {
        "id": 576,
        "action": "rollout",
        "bid_amount": null,
        "transaction": {
          "id": 761,
          "txid": "36a384a9080e8f1f5a301919a064cf2725e2d59f886caa88ab697e1f9446788d",
          "block": {
            "time": 1724162284
          }
        }
      },
      {
        "id": 759,
        "action": "transfer",
        "bid_amount": null,
        "transaction": {
          "id": 972,
          "txid": "59e7aa81cc51c760f1fab9525cedc08226ea50374ee5761846906d3323205f17",
          "block": {
            "time": 1725071514
          }
        }
      }
    ]
  },
  {
    "id": 234,
    "name": "@bid",
    "nameSha256": "8fe074831b742e2a41d19f762be9c95ab3dd96c20bbb93ada4174c3d9a5f0b3d",
    "status": "registered",
    "bid_amount": 1000,
    "claimHeight": 42481,
    "spacesHistoryId": 883,
    "createdAt": "2024-10-02T20:52:20.865Z",
    "updatedAt": "2024-10-02T20:52:34.413Z",
    "rank": "139",
    "history": [
      {
        "id": 552,
        "action": "bid",
        "bid_amount": 1000,
        "transaction": {
          "id": 745,
          "txid": "ed25e3714bf064afa9299fa00d33c65b26c0415145524701cbbcfe4422eac928",
          "block": {
            "time": 1724033718
          }
        }
      },
      {
        "id": 648,
        "action": "rollout",
        "bid_amount": null,
        "transaction": {
          "id": 838,
          "txid": "a13b8ed005f9abfc95498f1ad20d89b3c0e8908f3698dde0d334effa39b5a55d",
          "block": {
            "time": 1724530590
          }
        }
      },
      {
        "id": 883,
        "action": "transfer",
        "bid_amount": null,
        "transaction": {
          "id": 1107,
          "txid": "6ec09f24f64479c251515dc45feb384fe457fe3dfeb9a4842bc1548f5a9f518f",
          "block": {
            "time": 1725541244
          }
        }
      }
    ]
  },
  {
    "id": 392,
    "name": "@mytest5",
    "nameSha256": "909422d3dd33ace73422d954b124eab309e8fe6e2faad9a87b258a2c7746880c",
    "status": "auction",
    "bid_amount": 1000,
    "claimHeight": 52417,
    "spacesHistoryId": 1081,
    "createdAt": "2024-10-19T12:42:00.206Z",
    "updatedAt": "2024-10-20T05:45:00.521Z",
    "rank": "140",
    "history": [
      {
        "id": 1066,
        "action": "bid",
        "bid_amount": 1000,
        "transaction": {
          "id": 1391,
          "txid": "5a9569b9f61c635bef8e39003abb6ed303ad26add433d9ca9b32aecc3dbaa290",
          "block": {
            "time": 1729341684
          }
        }
      },
      {
        "id": 1081,
        "action": "rollout",
        "bid_amount": null,
        "transaction": {
          "id": 1416,
          "txid": "72cc2548c188250668d98cdd0e48b3333a01ebc33d305a4f5236423ca62b800f",
          "block": {
            "time": 1729403090
          }
        }
      }
    ]
  },
  {
    "id": 347,
    "name": "@taco",
    "nameSha256": "90f41c0ac28136b0b2a1f35e25621712b45617507be44c63278fa3ac9f0cfcf9",
    "status": "auction",
    "bid_amount": 1000,
    "claimHeight": 50545,
    "spacesHistoryId": 991,
    "createdAt": "2024-10-07T14:42:00.815Z",
    "updatedAt": "2024-10-08T04:29:00.197Z",
    "rank": "141",
    "history": [
      {
        "id": 938,
        "action": "bid",
        "bid_amount": 1000,
        "transaction": {
          "id": 1248,
          "txid": "a36af805bfcb492e0888b53b29424fd97ee020b1f66f0e395cad27db602eef0e",
          "block": {
            "time": 1728319307
          }
        }
      },
      {
        "id": 991,
        "action": "rollout",
        "bid_amount": null,
        "transaction": {
          "id": 1313,
          "txid": "dfc5fedf742b14271ccda5c80e42d7cf649a00f21ee26e2ce755434f02d2e4c4",
          "block": {
            "time": 1728368724
          }
        }
      }
    ]
  },
  {
    "id": 397,
    "name": "@mytest8",
    "nameSha256": "93ac16be55fa7f50d01af32e38e52142fbcf9ff4364145f6d9aa0b4e8189e288",
    "status": "auction",
    "bid_amount": 1000,
    "claimHeight": 52417,
    "spacesHistoryId": 1088,
    "createdAt": "2024-10-19T12:42:00.206Z",
    "updatedAt": "2024-10-20T05:45:00.521Z",
    "rank": "142",
    "history": [
      {
        "id": 1071,
        "action": "bid",
        "bid_amount": 1000,
        "transaction": {
          "id": 1401,
          "txid": "986ec373fa378f996ed1151985ca5d27eb4da2ef3a6d2c105593165cfcd2bce7",
          "block": {
            "time": 1729341684
          }
        }
      },
      {
        "id": 1088,
        "action": "rollout",
        "bid_amount": null,
        "transaction": {
          "id": 1416,
          "txid": "72cc2548c188250668d98cdd0e48b3333a01ebc33d305a4f5236423ca62b800f",
          "block": {
            "time": 1729403090
          }
        }
      }
    ]
  },
  {
    "id": 290,
    "name": "@asset",
    "nameSha256": "94a7cfe25f4af360557e866cfbd0efb10c1e85a3b5905ea686b4916894799446",
    "status": "revoked",
    "bid_amount": 1000,
    "claimHeight": null,
    "spacesHistoryId": 708,
    "createdAt": "2024-10-02T20:52:29.427Z",
    "updatedAt": "2024-10-02T20:52:29.479Z",
    "rank": "143",
    "history": [
      {
        "id": 703,
        "action": "bid",
        "bid_amount": 1000,
        "transaction": {
          "id": 904,
          "txid": "8c4882c3fde2194a9d08903d0cea6022429e1ff97e0ece8dcaa54c8cec00bf84",
          "block": {
            "time": 1724985721
          }
        }
      },
      {
        "id": 708,
        "action": "revoke",
        "bid_amount": null,
        "transaction": {
          "id": 911,
          "txid": "f8872f1cb9eadab45b5e81d06cbe446f410032cca6339b3607e82921102d440b",
          "block": {
            "time": 1724986924
          }
        }
      }
    ]
  },
  {
    "id": 321,
    "name": "@echo",
    "nameSha256": "962708168c09a712c9b15c016fa52ae88f71f27fb369b5c7e203f0d4fbcd6750",
    "status": "registered",
    "bid_amount": 1000,
    "claimHeight": 43633,
    "spacesHistoryId": 979,
    "createdAt": "2024-10-02T20:52:31.388Z",
    "updatedAt": "2024-10-07T15:39:00.891Z",
    "rank": "144",
    "history": [
      {
        "id": 797,
        "action": "bid",
        "bid_amount": 1000,
        "transaction": {
          "id": 1013,
          "txid": "0423cefce6efdb2b589cb0c8d318284cd27712edbd1106fe54910b03d864de7f",
          "block": {
            "time": 1725121917
          }
        }
      },
      {
        "id": 820,
        "action": "rollout",
        "bid_amount": null,
        "transaction": {
          "id": 1041,
          "txid": "df17732535dbf2580795415b751e95e2b94633d0ee623f2883458e1587d5936f",
          "block": {
            "time": 1725168709
          }
        }
      },
      {
        "id": 979,
        "action": "transfer",
        "bid_amount": null,
        "transaction": {
          "id": 1304,
          "txid": "5e63e2ed75da9344a66a21fc6c9cc75343b0e9914db6c53bfe2a65ddc9cf4aea",
          "block": {
            "time": 1728322721
          }
        }
      }
    ]
  },
  {
    "id": 369,
    "name": "@dns",
    "nameSha256": "9673ccc53fef3562492981a0b68f535b71f1d01a5dfd3a339f0056f919a57b32",
    "status": "auction",
    "bid_amount": 1000,
    "claimHeight": 50977,
    "spacesHistoryId": 1051,
    "createdAt": "2024-10-08T15:51:00.726Z",
    "updatedAt": "2024-10-10T15:40:00.396Z",
    "rank": "145",
    "history": [
      {
        "id": 1009,
        "action": "bid",
        "bid_amount": 1000,
        "transaction": {
          "id": 1336,
          "txid": "9fe73a804abec0e43a96dfa0c1005668d11ca8e21ec20149aac44fc611462ba8",
          "block": {
            "time": 1728409829
          }
        }
      },
      {
        "id": 1051,
        "action": "rollout",
        "bid_amount": null,
        "transaction": {
          "id": 1376,
          "txid": "1e46c34f547fb79f68cc297c6c5974acba4d5ad2f99297053c325f718f456a12",
          "block": {
            "time": 1728578686
          }
        }
      }
    ]
  },
  {
    "id": 379,
    "name": "@spice",
    "nameSha256": "978318e5484de484f0624324443669e8d353e2c33e4f96211869cb8e2741c41c",
    "status": "auction",
    "bid_amount": 1000,
    "claimHeight": 50977,
    "spacesHistoryId": 1050,
    "createdAt": "2024-10-08T16:32:00.211Z",
    "updatedAt": "2024-10-10T15:40:00.396Z",
    "rank": "146",
    "history": [
      {
        "id": 1019,
        "action": "bid",
        "bid_amount": 1000,
        "transaction": {
          "id": 1353,
          "txid": "257842be0454c0a5e34ec10ef8a3c55be0ec776bb143df180b9c52926c8ab7cf",
          "block": {
            "time": 1728412271
          }
        }
      },
      {
        "id": 1050,
        "action": "rollout",
        "bid_amount": null,
        "transaction": {
          "id": 1376,
          "txid": "1e46c34f547fb79f68cc297c6c5974acba4d5ad2f99297053c325f718f456a12",
          "block": {
            "time": 1728578686
          }
        }
      }
    ]
  },
  {
    "id": 402,
    "name": "@mytest113",
    "nameSha256": "97eaccfe8b1b5ceb04f80980a403529402b9525bff42f059265ccdb473f469c2",
    "status": "auction",
    "bid_amount": 1000,
    "claimHeight": 52417,
    "spacesHistoryId": 1086,
    "createdAt": "2024-10-19T12:42:00.206Z",
    "updatedAt": "2024-10-20T05:45:00.521Z",
    "rank": "147",
    "history": [
      {
        "id": 1076,
        "action": "bid",
        "bid_amount": 1000,
        "transaction": {
          "id": 1411,
          "txid": "1d1b06addc7da346cff5f06cd2bc11f7472ed32f1d04ed60b61bfc0a7a5a95bc",
          "block": {
            "time": 1729341684
          }
        }
      },
      {
        "id": 1086,
        "action": "rollout",
        "bid_amount": null,
        "transaction": {
          "id": 1416,
          "txid": "72cc2548c188250668d98cdd0e48b3333a01ebc33d305a4f5236423ca62b800f",
          "block": {
            "time": 1729403090
          }
        }
      }
    ]
  },
  {
    "id": 222,
    "name": "@green",
    "nameSha256": "97ee74a7606ae8959a29081dc05efe9e01235c816ece8336fe2ecebd3be82364",
    "status": "registered",
    "bid_amount": 1000,
    "claimHeight": 41617,
    "spacesHistoryId": 734,
    "createdAt": "2024-10-02T20:52:20.032Z",
    "updatedAt": "2024-10-02T20:52:29.562Z",
    "rank": "148",
    "history": [
      {
        "id": 530,
        "action": "bid",
        "bid_amount": 1000,
        "transaction": {
          "id": 720,
          "txid": "b4102fb8d96d77f71dd03b35d4784b4754c1bad59631cb51b952a77305d4de60",
          "block": {
            "time": 1723952686
          }
        }
      },
      {
        "id": 542,
        "action": "rollout",
        "bid_amount": null,
        "transaction": {
          "id": 729,
          "txid": "ed5fbad05e3c895cb4e183b1df94ec6928bad102c4ad689f7cc339bac8def4de",
          "block": {
            "time": 1723994427
          }
        }
      },
      {
        "id": 734,
        "action": "transfer",
        "bid_amount": null,
        "transaction": {
          "id": 947,
          "txid": "43c8794ae1352800b8d1c2e038247faab8b68830ecca1bbb76a699dd3958340c",
          "block": {
            "time": 1724985490
          }
        }
      }
    ]
  },
  {
    "id": 199,
    "name": "@x",
    "nameSha256": "9bc3a7c31e63cdbf57c8cbc6f2f57cf3cca521ba18246d0d79768220f6de09bc",
    "status": "registered",
    "bid_amount": 1000,
    "claimHeight": 41905,
    "spacesHistoryId": 756,
    "createdAt": "2024-10-02T20:52:19.419Z",
    "updatedAt": "2024-10-02T20:52:30.684Z",
    "rank": "149",
    "history": [
      {
        "id": 497,
        "action": "bid",
        "bid_amount": 1000,
        "transaction": {
          "id": 672,
          "txid": "be54d252de659d8d720fc8486e5d429ba8214261fceab0b0822956c466bc85af",
          "block": {
            "time": 1723908277
          }
        }
      },
      {
        "id": 579,
        "action": "rollout",
        "bid_amount": null,
        "transaction": {
          "id": 761,
          "txid": "36a384a9080e8f1f5a301919a064cf2725e2d59f886caa88ab697e1f9446788d",
          "block": {
            "time": 1724162284
          }
        }
      },
      {
        "id": 756,
        "action": "transfer",
        "bid_amount": null,
        "transaction": {
          "id": 969,
          "txid": "cabe00e00668feb17e518e0f4e39210264546ed982b305098e53f9e346785b4f",
          "block": {
            "time": 1725071514
          }
        }
      }
    ]
  },
  {
    "id": 366,
    "name": "@music",
    "nameSha256": "9c0d7239b60847d40537446899c15741b4258bd462302b66dce7ee5a5fd6b2ff",
    "status": "auction",
    "bid_amount": 1000,
    "claimHeight": 50689,
    "spacesHistoryId": 1038,
    "createdAt": "2024-10-08T15:51:00.726Z",
    "updatedAt": "2024-10-09T01:13:00.537Z",
    "rank": "150",
    "history": [
      {
        "id": 1006,
        "action": "bid",
        "bid_amount": 1000,
        "transaction": {
          "id": 1333,
          "txid": "e3ac491645af492b88c2d35c2ee22df87d73a04f30fbc17c83d405b1103e3790",
          "block": {
            "time": 1728409829
          }
        }
      },
      {
        "id": 1038,
        "action": "rollout",
        "bid_amount": null,
        "transaction": {
          "id": 1374,
          "txid": "01797a10e75cc91a87eccf99e01a59f203c9a6f720b9d30122590b355bd5da10",
          "block": {
            "time": 1728441324
          }
        }
      }
    ]
  },
  {
    "id": 356,
    "name": "@r",
    "nameSha256": "9c843933835fd3a10ad64ac4c16745c87f31606e649d93bc0cc923e4f0bbaa65",
    "status": "auction",
    "bid_amount": 1000,
    "claimHeight": 50545,
    "spacesHistoryId": 993,
    "createdAt": "2024-10-07T14:56:00.373Z",
    "updatedAt": "2024-10-08T04:29:00.197Z",
    "rank": "151",
    "history": [
      {
        "id": 947,
        "action": "bid",
        "bid_amount": 1000,
        "transaction": {
          "id": 1267,
          "txid": "ea907c3ed094b85b15f97f04ee17dfb26b031f64f8a4f6a185f85595c6741670",
          "block": {
            "time": 1728315456
          }
        }
      },
      {
        "id": 993,
        "action": "rollout",
        "bid_amount": null,
        "transaction": {
          "id": 1313,
          "txid": "dfc5fedf742b14271ccda5c80e42d7cf649a00f21ee26e2ce755434f02d2e4c4",
          "block": {
            "time": 1728368724
          }
        }
      }
    ]
  },
  {
    "id": 373,
    "name": "@pen",
    "nameSha256": "9f149d57e6e7ca578131b6f15ad069c3e544215451fd8000c6e11a8cf905c283",
    "status": "auction",
    "bid_amount": 1000,
    "claimHeight": 50689,
    "spacesHistoryId": 1032,
    "createdAt": "2024-10-08T15:51:00.726Z",
    "updatedAt": "2024-10-09T01:13:00.537Z",
    "rank": "152",
    "history": [
      {
        "id": 1013,
        "action": "bid",
        "bid_amount": 1000,
        "transaction": {
          "id": 1341,
          "txid": "64bd7cb4199da735aa0400d34e98d8bf51f7b72c085a3d0ef3f84aa37ad03fd2",
          "block": {
            "time": 1728409829
          }
        }
      },
      {
        "id": 1032,
        "action": "rollout",
        "bid_amount": null,
        "transaction": {
          "id": 1374,
          "txid": "01797a10e75cc91a87eccf99e01a59f203c9a6f720b9d30122590b355bd5da10",
          "block": {
            "time": 1728441324
          }
        }
      }
    ]
  },
  {
    "id": 349,
    "name": "@burrito",
    "nameSha256": "a14ccc12dbb49519dd8833b421411807a0ae715357063831e1047f35d34c6e58",
    "status": "auction",
    "bid_amount": 1000,
    "claimHeight": 50545,
    "spacesHistoryId": 989,
    "createdAt": "2024-10-07T14:42:00.815Z",
    "updatedAt": "2024-10-08T04:29:00.197Z",
    "rank": "153",
    "history": [
      {
        "id": 940,
        "action": "bid",
        "bid_amount": 1000,
        "transaction": {
          "id": 1252,
          "txid": "0ca6196dabea9bb9de2c84b14316e0487d10107544f371cadd7a617bbb44f2f9",
          "block": {
            "time": 1728319307
          }
        }
      },
      {
        "id": 989,
        "action": "rollout",
        "bid_amount": null,
        "transaction": {
          "id": 1313,
          "txid": "dfc5fedf742b14271ccda5c80e42d7cf649a00f21ee26e2ce755434f02d2e4c4",
          "block": {
            "time": 1728368724
          }
        }
      }
    ]
  },
  {
    "id": 299,
    "name": "@carry",
    "nameSha256": "a2332eebf615447cf86622206a69cdf1f528b434632e87905f4cd4f24e1e79a4",
    "status": "registered",
    "bid_amount": 1000,
    "claimHeight": 43345,
    "spacesHistoryId": 964,
    "createdAt": "2024-10-02T20:52:29.500Z",
    "updatedAt": "2024-10-07T15:39:00.891Z",
    "rank": "154",
    "history": [
      {
        "id": 715,
        "action": "bid",
        "bid_amount": 1000,
        "transaction": {
          "id": 924,
          "txid": "19f4fe3a55e766bf73fb156d603f02ba5136c801f995286b37c643fcd9e0c0ff",
          "block": {
            "time": 1724984665
          }
        }
      },
      {
        "id": 746,
        "action": "rollout",
        "bid_amount": null,
        "transaction": {
          "id": 966,
          "txid": "4e0e6fa469456a7030468269b8fd988e32c8f5cc888ce00120fa36a92d787cd0",
          "block": {
            "time": 1725027352
          }
        }
      },
      {
        "id": 964,
        "action": "transfer",
        "bid_amount": null,
        "transaction": {
          "id": 1289,
          "txid": "a3715efb7d3a0362df3421c843107d1a2cb76e8b019c236ce172ed662aa13806",
          "block": {
            "time": 1728322721
          }
        }
      }
    ]
  },
  {
    "id": 377,
    "name": "@ly",
    "nameSha256": "a43bc7d0754e845c9402aa88045503b5ae02bd704a8825df6f5016d1e19d505c",
    "status": "auction",
    "bid_amount": 1000,
    "claimHeight": 50833,
    "spacesHistoryId": 1044,
    "createdAt": "2024-10-08T16:32:00.211Z",
    "updatedAt": "2024-10-10T05:23:00.074Z",
    "rank": "155",
    "history": [
      {
        "id": 1017,
        "action": "bid",
        "bid_amount": 1000,
        "transaction": {
          "id": 1351,
          "txid": "91162024ab6867ea4e4c7dea633c02741822b8f28b8429ed9b5ca575810dc07d",
          "block": {
            "time": 1728412271
          }
        }
      },
      {
        "id": 1044,
        "action": "rollout",
        "bid_amount": null,
        "transaction": {
          "id": 1375,
          "txid": "62fc9c12df7532ea2e099642b0e3803c00ba3abd96ea9e7e21c85e8e5552cabb",
          "block": {
            "time": 1728544952
          }
        }
      }
    ]
  },
  {
    "id": 218,
    "name": "@galaxy",
    "nameSha256": "a48aba571b98e64a081d9e284152669a02ce1dc718a4d22cc5c08196a3ce9054",
    "status": "registered",
    "bid_amount": 1000,
    "claimHeight": 42481,
    "spacesHistoryId": 870,
    "createdAt": "2024-10-02T20:52:19.805Z",
    "updatedAt": "2024-10-02T20:52:34.413Z",
    "rank": "156",
    "history": [
      {
        "id": 526,
        "action": "bid",
        "bid_amount": 1000,
        "transaction": {
          "id": 712,
          "txid": "f12f310e65c3c2ecf7fca583b5acd06c175dc79808632b63f6d12e68757232d3",
          "block": {
            "time": 1723932235
          }
        }
      },
      {
        "id": 647,
        "action": "rollout",
        "bid_amount": null,
        "transaction": {
          "id": 838,
          "txid": "a13b8ed005f9abfc95498f1ad20d89b3c0e8908f3698dde0d334effa39b5a55d",
          "block": {
            "time": 1724530590
          }
        }
      },
      {
        "id": 870,
        "action": "transfer",
        "bid_amount": null,
        "transaction": {
          "id": 1087,
          "txid": "9d8536e750447fad238ff5dcf243ce5cce3038cf5bf381dd4d18783fd303339e",
          "block": {
            "time": 1725541244
          }
        }
      }
    ]
  },
  {
    "id": 264,
    "name": "@tx",
    "nameSha256": "a7520d2ccfc50cc1102b0c3093f526654f92879efa950b5a361778039b80e60c",
    "status": "registered",
    "bid_amount": 1000,
    "claimHeight": 42337,
    "spacesHistoryId": 853,
    "createdAt": "2024-10-02T20:52:23.845Z",
    "updatedAt": "2024-10-02T20:52:34.112Z",
    "rank": "157",
    "history": [
      {
        "id": 627,
        "action": "bid",
        "bid_amount": 1000,
        "transaction": {
          "id": 820,
          "txid": "4657a640467c161dd0cd2f09d4c8d251f4e42e0a2b83069ae5f0b0305313e699",
          "block": {
            "time": 1724333680
          }
        }
      },
      {
        "id": 637,
        "action": "rollout",
        "bid_amount": null,
        "transaction": {
          "id": 837,
          "txid": "13775265c5051319c78d5e8397534cc6a0863912e3103bffa7c8d36e48e11813",
          "block": {
            "time": 1724436541
          }
        }
      },
      {
        "id": 853,
        "action": "transfer",
        "bid_amount": null,
        "transaction": {
          "id": 1060,
          "txid": "e10c9d014fdcb521e829b8a3e40358cb4c116e314b91b82c421887d6e8268ea2",
          "block": {
            "time": 1725520217
          }
        }
      }
    ]
  },
  {
    "id": 362,
    "name": "@king",
    "nameSha256": "a7701745b7e9bf92a1bb1c66ba1235f31998d04c44f83915f1aaecc95c214d18",
    "status": "auction",
    "bid_amount": 1000,
    "claimHeight": 50689,
    "spacesHistoryId": 1037,
    "createdAt": "2024-10-08T15:51:00.726Z",
    "updatedAt": "2024-10-09T01:13:00.537Z",
    "rank": "158",
    "history": [
      {
        "id": 1002,
        "action": "bid",
        "bid_amount": 1000,
        "transaction": {
          "id": 1329,
          "txid": "338a61b917966acae831fe3482f2d46265e795e6c4137347bf7327e3a7443e03",
          "block": {
            "time": 1728409829
          }
        }
      },
      {
        "id": 1037,
        "action": "rollout",
        "bid_amount": null,
        "transaction": {
          "id": 1374,
          "txid": "01797a10e75cc91a87eccf99e01a59f203c9a6f720b9d30122590b355bd5da10",
          "block": {
            "time": 1728441324
          }
        }
      }
    ]
  },
  {
    "id": 274,
    "name": "@chain",
    "nameSha256": "a8a50d1c48613e8b114c3f3102141c2773aff32135186edd45f3f30424503bf4",
    "status": "registered",
    "bid_amount": 1000,
    "claimHeight": 42625,
    "spacesHistoryId": 888,
    "createdAt": "2024-10-02T20:52:26.048Z",
    "updatedAt": "2024-10-02T20:52:34.413Z",
    "rank": "159",
    "history": [
      {
        "id": 657,
        "action": "bid",
        "bid_amount": 1000,
        "transaction": {
          "id": 840,
          "txid": "c8b540e494b266e7a55999f2a63693a2d80601373f2b54f06e7feddb5834106c",
          "block": {
            "time": 1724598174
          }
        }
      },
      {
        "id": 670,
        "action": "rollout",
        "bid_amount": null,
        "transaction": {
          "id": 856,
          "txid": "efcf1152559ca55143c0602c153e383dbcddb912011f67a68ccd389e9b808c19",
          "block": {
            "time": 1724640859
          }
        }
      },
      {
        "id": 888,
        "action": "transfer",
        "bid_amount": null,
        "transaction": {
          "id": 1150,
          "txid": "e5667f63d806f96dce3bbd2811d0f46c8801fb244730e4d4ea254adb1ac0ce9b",
          "block": {
            "time": 1725541244
          }
        }
      }
    ]
  },
  {
    "id": 341,
    "name": "@sent",
    "nameSha256": "a9882c670452546abb076918e6319d9f3a57b9029574bdd02360bfe37a04f30c",
    "status": "registered",
    "bid_amount": 1000,
    "claimHeight": 44209,
    "spacesHistoryId": 936,
    "createdAt": "2024-10-02T20:52:34.413Z",
    "updatedAt": "2024-10-07T14:42:00.815Z",
    "rank": "160",
    "history": [
      {
        "id": 875,
        "action": "bid",
        "bid_amount": 1000,
        "transaction": {
          "id": 1092,
          "txid": "5944e7012843e17346f9735f3022e9bef7ac0cd86dcf038a347b40b9650c97ab",
          "block": {
            "time": 1725541244
          }
        }
      },
      {
        "id": 901,
        "action": "rollout",
        "bid_amount": null,
        "transaction": {
          "id": 1163,
          "txid": "bdbf6d1820f81455ffe142efeb5568b4f6ce9b82a769bbe32a053832e8bfdc10",
          "block": {
            "time": 1725583181
          }
        }
      },
      {
        "id": 936,
        "action": "transfer",
        "bid_amount": null,
        "transaction": {
          "id": 1245,
          "txid": "c2a38674ef426ff6361d050301b3b7dec049efb0623286d017e909eb6f9ec747",
          "block": {
            "time": 1728319307
          }
        }
      }
    ]
  },
  {
    "id": 318,
    "name": "@dude",
    "nameSha256": "aa5e653a6c192e8ba3e3b8034084b10941c349b0d34c1ac3902b6be81f0a38b3",
    "status": "registered",
    "bid_amount": 1000,
    "claimHeight": 43777,
    "spacesHistoryId": 918,
    "createdAt": "2024-10-02T20:52:31.388Z",
    "updatedAt": "2024-10-07T14:22:00.091Z",
    "rank": "161",
    "history": [
      {
        "id": 794,
        "action": "bid",
        "bid_amount": 1000,
        "transaction": {
          "id": 1007,
          "txid": "0a49ad0aea27f17bb192ba89cf781ba82136c10c5842c0900e9b5df18d1ace3d",
          "block": {
            "time": 1725121917
          }
        }
      },
      {
        "id": 825,
        "action": "rollout",
        "bid_amount": null,
        "transaction": {
          "id": 1043,
          "txid": "6d3e3777b3aaef22cbe5374c1dd946f59fff9821e182ee09bec3ae5a3a855205",
          "block": {
            "time": 1725381834
          }
        }
      },
      {
        "id": 918,
        "action": "transfer",
        "bid_amount": null,
        "transaction": {
          "id": 1227,
          "txid": "591c6f6a5d7abccb04af31ebda3f3dd7b35879c97b6a8d0d55244c778bc013cb",
          "block": {
            "time": 1728312983
          }
        }
      }
    ]
  },
  {
    "id": 296,
    "name": "@close",
    "nameSha256": "aa99cb4de8d696d5cedfe58774ab7cb43ec0883fa5a8066fd799916c41bc31ec",
    "status": "registered",
    "bid_amount": 1000,
    "claimHeight": 43345,
    "spacesHistoryId": 966,
    "createdAt": "2024-10-02T20:52:29.500Z",
    "updatedAt": "2024-10-07T15:39:00.891Z",
    "rank": "162",
    "history": [
      {
        "id": 712,
        "action": "bid",
        "bid_amount": 1000,
        "transaction": {
          "id": 918,
          "txid": "5ef1902fb11ecff57afe074c49a54f4ba8793834236d8e0c302e05fafefe8cb0",
          "block": {
            "time": 1724984665
          }
        }
      },
      {
        "id": 747,
        "action": "rollout",
        "bid_amount": null,
        "transaction": {
          "id": 966,
          "txid": "4e0e6fa469456a7030468269b8fd988e32c8f5cc888ce00120fa36a92d787cd0",
          "block": {
            "time": 1725027352
          }
        }
      },
      {
        "id": 966,
        "action": "transfer",
        "bid_amount": null,
        "transaction": {
          "id": 1291,
          "txid": "ec258ec3222d171c0f77deb5b700b64bbe93cc78e768fe2113f4395258a1835d",
          "block": {
            "time": 1728322721
          }
        }
      }
    ]
  },
  {
    "id": 294,
    "name": "@boat",
    "nameSha256": "ac2bf289aa35df2b65c90987106ef2dfb0146158bf9a9f81ed25bbf26e4fa11b",
    "status": "registered",
    "bid_amount": 1000,
    "claimHeight": 43489,
    "spacesHistoryId": 974,
    "createdAt": "2024-10-02T20:52:29.479Z",
    "updatedAt": "2024-10-07T15:39:00.891Z",
    "rank": "163",
    "history": [
      {
        "id": 710,
        "action": "bid",
        "bid_amount": 1000,
        "transaction": {
          "id": 914,
          "txid": "f79bba1505945442610789a8b2f4504b125d51534b93ff62548a33e7cb653d3a",
          "block": {
            "time": 1724986924
          }
        }
      },
      {
        "id": 767,
        "action": "rollout",
        "bid_amount": null,
        "transaction": {
          "id": 980,
          "txid": "a597bd6da3574cba043c317748ecab5bd64534c5daffa78a5e7f8ac0e7403bd9",
          "block": {
            "time": 1725089125
          }
        }
      },
      {
        "id": 974,
        "action": "transfer",
        "bid_amount": null,
        "transaction": {
          "id": 1299,
          "txid": "2a160f6daef9afd94db5048ebf5f46acfbc0e9f28c345de74e4d671dce49e229",
          "block": {
            "time": 1728322721
          }
        }
      }
    ]
  },
  {
    "id": 219,
    "name": "@meteor",
    "nameSha256": "ad14c15f713dbd0e9cfe9ca72932e8ab29fe1c93800820a551ecd0c8f5dfaa60",
    "status": "registered",
    "bid_amount": 1000,
    "claimHeight": 41617,
    "spacesHistoryId": 733,
    "createdAt": "2024-10-02T20:52:19.805Z",
    "updatedAt": "2024-10-02T20:52:29.562Z",
    "rank": "164",
    "history": [
      {
        "id": 527,
        "action": "bid",
        "bid_amount": 1000,
        "transaction": {
          "id": 714,
          "txid": "3df883827e84bcee09bad2ac03bc73adaac996d0e0889eac1aee060374e9c55a",
          "block": {
            "time": 1723932235
          }
        }
      },
      {
        "id": 541,
        "action": "rollout",
        "bid_amount": null,
        "transaction": {
          "id": 729,
          "txid": "ed5fbad05e3c895cb4e183b1df94ec6928bad102c4ad689f7cc339bac8def4de",
          "block": {
            "time": 1723994427
          }
        }
      },
      {
        "id": 733,
        "action": "transfer",
        "bid_amount": null,
        "transaction": {
          "id": 946,
          "txid": "ce0319f1bf8e522e9b08d4e69392329ef71ac29a5cc585b2b415274fe9a59ad3",
          "block": {
            "time": 1724985490
          }
        }
      }
    ]
  },
  {
    "id": 253,
    "name": "@mode",
    "nameSha256": "ad3ef75019add80738f7966139398b6442650cd986d2b833513a1b955851c4c9",
    "status": "registered",
    "bid_amount": 1000,
    "claimHeight": 42481,
    "spacesHistoryId": 867,
    "createdAt": "2024-10-02T20:52:22.915Z",
    "updatedAt": "2024-10-02T20:52:34.413Z",
    "rank": "165",
    "history": [
      {
        "id": 596,
        "action": "bid",
        "bid_amount": 1000,
        "transaction": {
          "id": 794,
          "txid": "c9f1309c1dbca3de3a2cf6275fac39307706586cddf539923c458236abf8cfba",
          "block": {
            "time": 1724251887
          }
        }
      },
      {
        "id": 650,
        "action": "rollout",
        "bid_amount": null,
        "transaction": {
          "id": 838,
          "txid": "a13b8ed005f9abfc95498f1ad20d89b3c0e8908f3698dde0d334effa39b5a55d",
          "block": {
            "time": 1724530590
          }
        }
      },
      {
        "id": 867,
        "action": "transfer",
        "bid_amount": null,
        "transaction": {
          "id": 1084,
          "txid": "0062a65b98aef81ab8e71d2d169d0654dbfa62f628e344690235b56388729615",
          "block": {
            "time": 1725541244
          }
        }
      }
    ]
  },
  {
    "id": 314,
    "name": "@document",
    "nameSha256": "b17abc69ca6607673f4689a402a4c60ef4d94397f9c4090ee1bc30d63b09e447",
    "status": "registered",
    "bid_amount": 1000,
    "claimHeight": 43633,
    "spacesHistoryId": 980,
    "createdAt": "2024-10-02T20:52:31.388Z",
    "updatedAt": "2024-10-07T15:39:00.891Z",
    "rank": "166",
    "history": [
      {
        "id": 790,
        "action": "bid",
        "bid_amount": 1000,
        "transaction": {
          "id": 999,
          "txid": "3e3692998536fbe32ce4479a2d770ae8f37034f22a4dc5d61cfb6d20610af01e",
          "block": {
            "time": 1725121917
          }
        }
      },
      {
        "id": 813,
        "action": "rollout",
        "bid_amount": null,
        "transaction": {
          "id": 1041,
          "txid": "df17732535dbf2580795415b751e95e2b94633d0ee623f2883458e1587d5936f",
          "block": {
            "time": 1725168709
          }
        }
      },
      {
        "id": 980,
        "action": "transfer",
        "bid_amount": null,
        "transaction": {
          "id": 1305,
          "txid": "f660a44875dc5122e6dbb8e88b4caf6f499ada8f700b07dbdb381de7a660a895",
          "block": {
            "time": 1728322721
          }
        }
      }
    ]
  },
  {
    "id": 304,
    "name": "@wine",
    "nameSha256": "b25c92b8f697791b943a8279a421c3666a45b601ff8796357efeb96b86ff765a",
    "status": "registered",
    "bid_amount": 1000,
    "claimHeight": 43345,
    "spacesHistoryId": 965,
    "createdAt": "2024-10-02T20:52:29.562Z",
    "updatedAt": "2024-10-07T15:39:00.891Z",
    "rank": "167",
    "history": [
      {
        "id": 738,
        "action": "bid",
        "bid_amount": 1000,
        "transaction": {
          "id": 954,
          "txid": "d05c0632754b1572bdbbfdb37eed0ee54d8f6c11854cf3992d98fcfe7eeef573",
          "block": {
            "time": 1724985490
          }
        }
      },
      {
        "id": 745,
        "action": "rollout",
        "bid_amount": null,
        "transaction": {
          "id": 966,
          "txid": "4e0e6fa469456a7030468269b8fd988e32c8f5cc888ce00120fa36a92d787cd0",
          "block": {
            "time": 1725027352
          }
        }
      },
      {
        "id": 965,
        "action": "transfer",
        "bid_amount": null,
        "transaction": {
          "id": 1290,
          "txid": "8bd3514793e3e629a0b1816aec791e648e986ca1cdaadd0b3f08676c479f6f31",
          "block": {
            "time": 1728322721
          }
        }
      }
    ]
  },
  {
    "id": 252,
    "name": "@tank",
    "nameSha256": "b50fc861c1eb81b014011eca4959135e28f668e5479198b7d5b78177379e7ff1",
    "status": "registered",
    "bid_amount": 1000,
    "claimHeight": 42049,
    "spacesHistoryId": 783,
    "createdAt": "2024-10-02T20:52:22.852Z",
    "updatedAt": "2024-10-02T20:52:31.319Z",
    "rank": "168",
    "history": [
      {
        "id": 595,
        "action": "bid",
        "bid_amount": 1000,
        "transaction": {
          "id": 792,
          "txid": "c84d7190caf61a57d8cfd5c778cae6f33f42066cb56ec4ab54e771dcde009c85",
          "block": {
            "time": 1724249541
          }
        }
      },
      {
        "id": 610,
        "action": "rollout",
        "bid_amount": null,
        "transaction": {
          "id": 811,
          "txid": "b38f1a9aaa4ce4be5112ca50fe181b7880b1f8474c052a8662881295c38d0be3",
          "block": {
            "time": 1724255932
          }
        }
      },
      {
        "id": 783,
        "action": "transfer",
        "bid_amount": null,
        "transaction": {
          "id": 987,
          "txid": "d9b5f6b1989f1e57191ab7e910e5714051ec3a5e34bfa36ac43db7d449fa1876",
          "block": {
            "time": 1725118410
          }
        }
      }
    ]
  },
  {
    "id": 319,
    "name": "@each",
    "nameSha256": "b7e1f8be61a683c2dd2b2179ff1def4102b2162af8677d76b2c71878556e9cf5",
    "status": "registered",
    "bid_amount": 1000,
    "claimHeight": 43777,
    "spacesHistoryId": 919,
    "createdAt": "2024-10-02T20:52:31.388Z",
    "updatedAt": "2024-10-07T14:22:00.091Z",
    "rank": "169",
    "history": [
      {
        "id": 795,
        "action": "bid",
        "bid_amount": 1000,
        "transaction": {
          "id": 1009,
          "txid": "d1b807f2b30426f7c3ebb85003ef481121a8cc8ab737557eb78e0d8b044e55a9",
          "block": {
            "time": 1725121917
          }
        }
      },
      {
        "id": 826,
        "action": "rollout",
        "bid_amount": null,
        "transaction": {
          "id": 1043,
          "txid": "6d3e3777b3aaef22cbe5374c1dd946f59fff9821e182ee09bec3ae5a3a855205",
          "block": {
            "time": 1725381834
          }
        }
      },
      {
        "id": 919,
        "action": "transfer",
        "bid_amount": null,
        "transaction": {
          "id": 1228,
          "txid": "0119e4b65ed0fd3797fd38fc4fb8ca4a2cb283f82c2b27574d0fbc74ae42b75a",
          "block": {
            "time": 1728312983
          }
        }
      }
    ]
  },
  {
    "id": 205,
    "name": "@sell",
    "nameSha256": "b9e6ed068184ce82d62d01a08cae4304a5dfb6fc3473db90238feb285f2ba5a3",
    "status": "registered",
    "bid_amount": 1000,
    "claimHeight": 41473,
    "spacesHistoryId": 729,
    "createdAt": "2024-10-02T20:52:19.508Z",
    "updatedAt": "2024-10-02T20:52:29.562Z",
    "rank": "170",
    "history": [
      {
        "id": 503,
        "action": "bid",
        "bid_amount": 1000,
        "transaction": {
          "id": 685,
          "txid": "41f9998adc9f774606b41f84968d4a1539bb2c96c03b61d3b7b5890a0859f87a",
          "block": {
            "time": 1723909697
          }
        }
      },
      {
        "id": 512,
        "action": "rollout",
        "bid_amount": null,
        "transaction": {
          "id": 696,
          "txid": "748b434660b2026ece4275ad25e730a27321656b638c4e3929f65dcff689d1d2",
          "block": {
            "time": 1723926719
          }
        }
      },
      {
        "id": 729,
        "action": "transfer",
        "bid_amount": null,
        "transaction": {
          "id": 942,
          "txid": "9b1f3012e6f869adbd90d0e8cfdfb74de01331cfa88f6d1317ab84374f6a4834",
          "block": {
            "time": 1724985490
          }
        }
      }
    ]
  },
  {
    "id": 361,
    "name": "@v",
    "nameSha256": "ba3bb12ad365108e4459f2b6fa6884f912eefbb9329426b5be410269d741a6b7",
    "status": "auction",
    "bid_amount": 1000,
    "claimHeight": 50545,
    "spacesHistoryId": 990,
    "createdAt": "2024-10-07T14:56:00.373Z",
    "updatedAt": "2024-10-08T04:29:00.197Z",
    "rank": "171",
    "history": [
      {
        "id": 952,
        "action": "bid",
        "bid_amount": 1000,
        "transaction": {
          "id": 1277,
          "txid": "cc981999a09f5c0b6f17f037a7ca7d57f384e6645a822a16d417aa6d045c28b2",
          "block": {
            "time": 1728315456
          }
        }
      },
      {
        "id": 990,
        "action": "rollout",
        "bid_amount": null,
        "transaction": {
          "id": 1313,
          "txid": "dfc5fedf742b14271ccda5c80e42d7cf649a00f21ee26e2ce755434f02d2e4c4",
          "block": {
            "time": 1728368724
          }
        }
      }
    ]
  },
  {
    "id": 247,
    "name": "@luck",
    "nameSha256": "bd40f135561c2d12aefa942a3a846dd531319bcda6514bc548eeea97c651a6e2",
    "status": "registered",
    "bid_amount": 1000,
    "claimHeight": 42193,
    "spacesHistoryId": 846,
    "createdAt": "2024-10-02T20:52:22.852Z",
    "updatedAt": "2024-10-02T20:52:34.112Z",
    "rank": "172",
    "history": [
      {
        "id": 590,
        "action": "bid",
        "bid_amount": 1000,
        "transaction": {
          "id": 782,
          "txid": "c00d77eaf5ed4a907d4df6d258350810d0942bd3bf1d1d9c6f63ad3a9ebc85e5",
          "block": {
            "time": 1724249541
          }
        }
      },
      {
        "id": 622,
        "action": "rollout",
        "bid_amount": null,
        "transaction": {
          "id": 816,
          "txid": "7af1e824358c2644ef73e4e1ebde8d2fe27ed5ee4af29dc068bc723080ccbb1d",
          "block": {
            "time": 1724329893
          }
        }
      },
      {
        "id": 846,
        "action": "transfer",
        "bid_amount": null,
        "transaction": {
          "id": 1053,
          "txid": "5a9bbed7b35d71f6a2dcea4fd4e7d8037c86c17848dd29212c744c40bd7ab16f",
          "block": {
            "time": 1725520217
          }
        }
      }
    ]
  },
  {
    "id": 355,
    "name": "@7",
    "nameSha256": "c0b35da2dc8fbe332e3ee067b21f1aa171ca4aad717639be4e9c43f626229d66",
    "status": "auction",
    "bid_amount": 1000,
    "claimHeight": 50545,
    "spacesHistoryId": 988,
    "createdAt": "2024-10-07T14:56:00.373Z",
    "updatedAt": "2024-10-08T04:29:00.197Z",
    "rank": "173",
    "history": [
      {
        "id": 946,
        "action": "bid",
        "bid_amount": 1000,
        "transaction": {
          "id": 1265,
          "txid": "b54d63b88fbf72f2f0f4cf9e7b4bab77923bf7861966ac61f4c13ff1feb9f7c2",
          "block": {
            "time": 1728315456
          }
        }
      },
      {
        "id": 988,
        "action": "rollout",
        "bid_amount": null,
        "transaction": {
          "id": 1313,
          "txid": "dfc5fedf742b14271ccda5c80e42d7cf649a00f21ee26e2ce755434f02d2e4c4",
          "block": {
            "time": 1728368724
          }
        }
      }
    ]
  },
  {
    "id": 273,
    "name": "@azul",
    "nameSha256": "c0c6ca546fb27f45b1bd13a4b45f60deb2e399fa183ba7d6a042131f86005cd2",
    "status": "registered",
    "bid_amount": 1000,
    "claimHeight": 42337,
    "spacesHistoryId": 850,
    "createdAt": "2024-10-02T20:52:24.475Z",
    "updatedAt": "2024-10-02T20:52:34.112Z",
    "rank": "174",
    "history": [
      {
        "id": 636,
        "action": "bid",
        "bid_amount": 1000,
        "transaction": {
          "id": 836,
          "txid": "17ac69039a7533f8354b4565485993b6353eccfb1d4d87b94a87351a5c687426",
          "block": {
            "time": 1724419385
          }
        }
      },
      {
        "id": 640,
        "action": "rollout",
        "bid_amount": null,
        "transaction": {
          "id": 837,
          "txid": "13775265c5051319c78d5e8397534cc6a0863912e3103bffa7c8d36e48e11813",
          "block": {
            "time": 1724436541
          }
        }
      },
      {
        "id": 850,
        "action": "transfer",
        "bid_amount": null,
        "transaction": {
          "id": 1057,
          "txid": "efa996325beb188410dd466e5f287b3b75b9b1840b977a33071e99ecfa147a5d",
          "block": {
            "time": 1725520217
          }
        }
      }
    ]
  },
  {
    "id": 308,
    "name": "@count",
    "nameSha256": "c15194a13c69e02d53c8b374b2876493ec46468187b3ebc071903cecbedda1cc",
    "status": "registered",
    "bid_amount": 1000,
    "claimHeight": 43489,
    "spacesHistoryId": 975,
    "createdAt": "2024-10-02T20:52:29.635Z",
    "updatedAt": "2024-10-07T15:39:00.891Z",
    "rank": "175",
    "history": [
      {
        "id": 743,
        "action": "bid",
        "bid_amount": 1000,
        "transaction": {
          "id": 963,
          "txid": "d0f045ad9d7c053ba32d580c8c31f554083788a48964700749fa1172ab2405e5",
          "block": {
            "time": 1724987894
          }
        }
      },
      {
        "id": 775,
        "action": "rollout",
        "bid_amount": null,
        "transaction": {
          "id": 980,
          "txid": "a597bd6da3574cba043c317748ecab5bd64534c5daffa78a5e7f8ac0e7403bd9",
          "block": {
            "time": 1725089125
          }
        }
      },
      {
        "id": 975,
        "action": "transfer",
        "bid_amount": null,
        "transaction": {
          "id": 1300,
          "txid": "a2eaf65af7c82f8bc96651c9b97d51287603f95bfe8ca41150ab6fa010499b91",
          "block": {
            "time": 1728322721
          }
        }
      }
    ]
  },
  {
    "id": 399,
    "name": "@mytest10",
    "nameSha256": "c17dc7dbdb84371b075cc09666ebadd226e45cf4abd1e6271133a200e36789ff",
    "status": "auction",
    "bid_amount": 1000,
    "claimHeight": 52417,
    "spacesHistoryId": 1082,
    "createdAt": "2024-10-19T12:42:00.206Z",
    "updatedAt": "2024-10-20T05:45:00.521Z",
    "rank": "176",
    "history": [
      {
        "id": 1073,
        "action": "bid",
        "bid_amount": 1000,
        "transaction": {
          "id": 1405,
          "txid": "3b2fe80e34d0ebfa91ad3048974c36210ac2b6d4ca47bc2b596a0468603e289c",
          "block": {
            "time": 1729341684
          }
        }
      },
      {
        "id": 1082,
        "action": "rollout",
        "bid_amount": null,
        "transaction": {
          "id": 1416,
          "txid": "72cc2548c188250668d98cdd0e48b3333a01ebc33d305a4f5236423ca62b800f",
          "block": {
            "time": 1729403090
          }
        }
      }
    ]
  },
  {
    "id": 206,
    "name": "@send",
    "nameSha256": "c78c8349757edb31a339b4677319168d2f5913d51f5dca8d5b907bad04cff50f",
    "status": "registered",
    "bid_amount": 1000,
    "claimHeight": 41473,
    "spacesHistoryId": 726,
    "createdAt": "2024-10-02T20:52:19.508Z",
    "updatedAt": "2024-10-02T20:52:29.562Z",
    "rank": "177",
    "history": [
      {
        "id": 504,
        "action": "bid",
        "bid_amount": 1000,
        "transaction": {
          "id": 687,
          "txid": "5e6ea172dce0102f6f61396f2407097a5be16f6bf289cfe4b48a97652734ccba",
          "block": {
            "time": 1723909697
          }
        }
      },
      {
        "id": 514,
        "action": "rollout",
        "bid_amount": null,
        "transaction": {
          "id": 696,
          "txid": "748b434660b2026ece4275ad25e730a27321656b638c4e3929f65dcff689d1d2",
          "block": {
            "time": 1723926719
          }
        }
      },
      {
        "id": 726,
        "action": "transfer",
        "bid_amount": null,
        "transaction": {
          "id": 939,
          "txid": "6e991e71c605c4eaf0ecacb34d21d1a76114622e827c51591a1227a1f659215b",
          "block": {
            "time": 1724985490
          }
        }
      }
    ]
  },
  {
    "id": 254,
    "name": "@domain",
    "nameSha256": "ca40792d63c62d47da6f6963e0df22e34db814a1605671d8487efcbdcdf287ff",
    "status": "registered",
    "bid_amount": 1000,
    "claimHeight": 42193,
    "spacesHistoryId": 839,
    "createdAt": "2024-10-02T20:52:22.915Z",
    "updatedAt": "2024-10-02T20:52:34.093Z",
    "rank": "178",
    "history": [
      {
        "id": 597,
        "action": "bid",
        "bid_amount": 1000,
        "transaction": {
          "id": 796,
          "txid": "8853533d120319bb524a82a22931ad1838f861f112db9a6696a5ccc7d1b4c8cf",
          "block": {
            "time": 1724251887
          }
        }
      },
      {
        "id": 621,
        "action": "rollout",
        "bid_amount": null,
        "transaction": {
          "id": 816,
          "txid": "7af1e824358c2644ef73e4e1ebde8d2fe27ed5ee4af29dc068bc723080ccbb1d",
          "block": {
            "time": 1724329893
          }
        }
      },
      {
        "id": 839,
        "action": "transfer",
        "bid_amount": null,
        "transaction": {
          "id": 1046,
          "txid": "e8b5dd125f11459965bd2c14f60adc8a2bba3572cde4da3a5908cdfe8ca8b503",
          "block": {
            "time": 1725524058
          }
        }
      }
    ]
  },
  {
    "id": 291,
    "name": "@array",
    "nameSha256": "cb17b255dba8e15b3004e5a64d85f545f703589f4f387fda9aa81d5952c00849",
    "status": "registered",
    "bid_amount": 1000,
    "claimHeight": 43345,
    "spacesHistoryId": 963,
    "createdAt": "2024-10-02T20:52:29.427Z",
    "updatedAt": "2024-10-07T14:59:00.459Z",
    "rank": "179",
    "history": [
      {
        "id": 705,
        "action": "bid",
        "bid_amount": 1000,
        "transaction": {
          "id": 907,
          "txid": "cb7627fd26f23d5e7b4ddc8444d86497d57305871e0b414ad8d5af0d99b51466",
          "block": {
            "time": 1724985721
          }
        }
      },
      {
        "id": 752,
        "action": "rollout",
        "bid_amount": null,
        "transaction": {
          "id": 966,
          "txid": "4e0e6fa469456a7030468269b8fd988e32c8f5cc888ce00120fa36a92d787cd0",
          "block": {
            "time": 1725027352
          }
        }
      },
      {
        "id": 963,
        "action": "transfer",
        "bid_amount": null,
        "transaction": {
          "id": 1288,
          "txid": "2f6a3aaf599f9c2d46d305875cf63a97883a8a811601a8f09c9e325e3d4693fb",
          "block": {
            "time": 1728320319
          }
        }
      }
    ]
  },
  {
    "id": 275,
    "name": "@files",
    "nameSha256": "cbd85a23c8a208e1b8e7ebdfef2822395b9256b2ca29e293f447a60ce36b3ea4",
    "status": "registered",
    "bid_amount": 1000,
    "claimHeight": 42625,
    "spacesHistoryId": 889,
    "createdAt": "2024-10-02T20:52:26.048Z",
    "updatedAt": "2024-10-02T20:52:34.413Z",
    "rank": "180",
    "history": [
      {
        "id": 658,
        "action": "bid",
        "bid_amount": 1000,
        "transaction": {
          "id": 845,
          "txid": "ba73a857f0eed2fef226ab1d470c300488cc09f7b4bd1f4c6ee5e1672a7c04d6",
          "block": {
            "time": 1724598174
          }
        }
      },
      {
        "id": 666,
        "action": "rollout",
        "bid_amount": null,
        "transaction": {
          "id": 856,
          "txid": "efcf1152559ca55143c0602c153e383dbcddb912011f67a68ccd389e9b808c19",
          "block": {
            "time": 1724640859
          }
        }
      },
      {
        "id": 889,
        "action": "transfer",
        "bid_amount": null,
        "transaction": {
          "id": 1151,
          "txid": "5986470e002022af9ca933f463f13879954df4abae09e2a2e74fb2b7e0c9767a",
          "block": {
            "time": 1725541244
          }
        }
      }
    ]
  },
  {
    "id": 312,
    "name": "@detail",
    "nameSha256": "cc1110f290a9a1dbda385ff50537d06ef929b937009e4c4b2a9a44611ea7a7b0",
    "status": "registered",
    "bid_amount": 1000,
    "claimHeight": 43633,
    "spacesHistoryId": 984,
    "createdAt": "2024-10-02T20:52:31.388Z",
    "updatedAt": "2024-10-07T15:39:00.891Z",
    "rank": "181",
    "history": [
      {
        "id": 788,
        "action": "bid",
        "bid_amount": 1000,
        "transaction": {
          "id": 995,
          "txid": "f73001ac4536703d1c842d4380a83de772b142d351b0967742a11e902a6b19f0",
          "block": {
            "time": 1725121917
          }
        }
      },
      {
        "id": 818,
        "action": "rollout",
        "bid_amount": null,
        "transaction": {
          "id": 1041,
          "txid": "df17732535dbf2580795415b751e95e2b94633d0ee623f2883458e1587d5936f",
          "block": {
            "time": 1725168709
          }
        }
      },
      {
        "id": 984,
        "action": "transfer",
        "bid_amount": null,
        "transaction": {
          "id": 1309,
          "txid": "fc6ac5532edbec7b4ef6c087d6eb74aaab21082aa14b3323e135344b8dc99ed0",
          "block": {
            "time": 1728322721
          }
        }
      }
    ]
  },
  {
    "id": 201,
    "name": "@money",
    "nameSha256": "cd2f7aa8fb4508c057b8dc8ea14f67a5b04fa704adf5e84a39409d370b9ec8c6",
    "status": "registered",
    "bid_amount": 1000,
    "claimHeight": 41473,
    "spacesHistoryId": 692,
    "createdAt": "2024-10-02T20:52:19.419Z",
    "updatedAt": "2024-10-02T20:52:29.398Z",
    "rank": "182",
    "history": [
      {
        "id": 499,
        "action": "bid",
        "bid_amount": 1000,
        "transaction": {
          "id": 676,
          "txid": "d97c12662b58bd0efa09e225c155eaaaf413c212bd1971e002c5ab35dcf80d0e",
          "block": {
            "time": 1723908277
          }
        }
      },
      {
        "id": 510,
        "action": "rollout",
        "bid_amount": null,
        "transaction": {
          "id": 696,
          "txid": "748b434660b2026ece4275ad25e730a27321656b638c4e3929f65dcff689d1d2",
          "block": {
            "time": 1723926719
          }
        }
      },
      {
        "id": 692,
        "action": "transfer",
        "bid_amount": null,
        "transaction": {
          "id": 889,
          "txid": "a74304807abf8e0b3eafde7ad53280f6dac12e5158b23212ba46b067398750db",
          "block": {
            "time": 1724984520
          }
        }
      }
    ]
  },
  {
    "id": 367,
    "name": "@reg",
    "nameSha256": "ce760e250101283afcfb9635dc38dcf80d08830ae9d8371fe8c57db69d42ec4b",
    "status": "auction",
    "bid_amount": 1000,
    "claimHeight": 51121,
    "spacesHistoryId": 1063,
    "createdAt": "2024-10-08T15:51:00.726Z",
    "updatedAt": "2024-10-11T01:13:00.785Z",
    "rank": "183",
    "history": [
      {
        "id": 1007,
        "action": "bid",
        "bid_amount": 1000,
        "transaction": {
          "id": 1334,
          "txid": "3cfa5b3632be72d6af6fba891b6055a3b215cf04171f3c2db17e8a36fb750d95",
          "block": {
            "time": 1728409829
          }
        }
      },
      {
        "id": 1063,
        "action": "rollout",
        "bid_amount": null,
        "transaction": {
          "id": 1377,
          "txid": "44f0b479f7c1e1b4f6120e26b958b2e0a29a336ace75c6f06f763f3ab9627361",
          "block": {
            "time": 1728613773
          }
        }
      }
    ]
  },
  {
    "id": 268,
    "name": "@put",
    "nameSha256": "cf237a862f8ad7431278cb60ee977f3f687522aa846ba2daa8f8a3d84c5b769d",
    "status": "registered",
    "bid_amount": 1000,
    "claimHeight": 42337,
    "spacesHistoryId": 852,
    "createdAt": "2024-10-02T20:52:23.845Z",
    "updatedAt": "2024-10-02T20:52:34.112Z",
    "rank": "184",
    "history": [
      {
        "id": 631,
        "action": "bid",
        "bid_amount": 1000,
        "transaction": {
          "id": 827,
          "txid": "b58d099e62777a9cbc925b7507db572522e941cb048ea05b7a7140adc961db35",
          "block": {
            "time": 1724333680
          }
        }
      },
      {
        "id": 644,
        "action": "rollout",
        "bid_amount": null,
        "transaction": {
          "id": 837,
          "txid": "13775265c5051319c78d5e8397534cc6a0863912e3103bffa7c8d36e48e11813",
          "block": {
            "time": 1724436541
          }
        }
      },
      {
        "id": 852,
        "action": "transfer",
        "bid_amount": null,
        "transaction": {
          "id": 1059,
          "txid": "3cf688da6a76293608a066624bcf9a919343dfd17be0f4a0102b83bb4e598898",
          "block": {
            "time": 1725520217
          }
        }
      }
    ]
  },
  {
    "id": 214,
    "name": "@asteroid",
    "nameSha256": "d03a9faf869041f0ac930c5bf22f6aaeb919f98ad34bbddf3dd9cca147040ec9",
    "status": "registered",
    "bid_amount": 1000,
    "claimHeight": 41617,
    "spacesHistoryId": 735,
    "createdAt": "2024-10-02T20:52:19.805Z",
    "updatedAt": "2024-10-02T20:52:29.562Z",
    "rank": "185",
    "history": [
      {
        "id": 522,
        "action": "bid",
        "bid_amount": 1000,
        "transaction": {
          "id": 704,
          "txid": "048cfd542a89af8ad604152914d393e8216baca7e9ef44624275e8a3ed39893d",
          "block": {
            "time": 1723932235
          }
        }
      },
      {
        "id": 540,
        "action": "rollout",
        "bid_amount": null,
        "transaction": {
          "id": 729,
          "txid": "ed5fbad05e3c895cb4e183b1df94ec6928bad102c4ad689f7cc339bac8def4de",
          "block": {
            "time": 1723994427
          }
        }
      },
      {
        "id": 735,
        "action": "transfer",
        "bid_amount": null,
        "transaction": {
          "id": 948,
          "txid": "7fa63dfc1554024edacaddf63aa9e55bf9c07d4a573270d9dd6e29758ed00d71",
          "block": {
            "time": 1724985490
          }
        }
      }
    ]
  },
  {
    "id": 387,
    "name": "@usa",
    "nameSha256": "d100f068b2ff5b2867ebca5ef9515e272376502a97125a94d47d816e9fd0b17e",
    "status": "auction",
    "bid_amount": 1000,
    "claimHeight": 50689,
    "spacesHistoryId": 1039,
    "createdAt": "2024-10-08T16:32:00.211Z",
    "updatedAt": "2024-10-09T01:13:00.537Z",
    "rank": "186",
    "history": [
      {
        "id": 1027,
        "action": "bid",
        "bid_amount": 1000,
        "transaction": {
          "id": 1369,
          "txid": "12e0c663db10f8567f8717b830e24eba4c9f4cac6d0b2d868f5b9b7fa874af53",
          "block": {
            "time": 1728412271
          }
        }
      },
      {
        "id": 1039,
        "action": "rollout",
        "bid_amount": null,
        "transaction": {
          "id": 1374,
          "txid": "01797a10e75cc91a87eccf99e01a59f203c9a6f720b9d30122590b355bd5da10",
          "block": {
            "time": 1728441324
          }
        }
      }
    ]
  },
  {
    "id": 363,
    "name": "@crown",
    "nameSha256": "d26619261c7249700db15c5708d75fe40d2814311f048edb2cc775dbfc128a9e",
    "status": "auction",
    "bid_amount": 1000,
    "claimHeight": 50977,
    "spacesHistoryId": 1057,
    "createdAt": "2024-10-08T15:51:00.726Z",
    "updatedAt": "2024-10-10T15:40:00.396Z",
    "rank": "187",
    "history": [
      {
        "id": 1003,
        "action": "bid",
        "bid_amount": 1000,
        "transaction": {
          "id": 1330,
          "txid": "cb5dc841e3faebde49eeefef7f17421d4c68b46907295e9ab457d24a101c4a14",
          "block": {
            "time": 1728409829
          }
        }
      },
      {
        "id": 1057,
        "action": "rollout",
        "bid_amount": null,
        "transaction": {
          "id": 1376,
          "txid": "1e46c34f547fb79f68cc297c6c5974acba4d5ad2f99297053c325f718f456a12",
          "block": {
            "time": 1728578686
          }
        }
      }
    ]
  },
  {
    "id": 216,
    "name": "@sun",
    "nameSha256": "d3c156925a1e79dd58dea487a2572603750a6578ed9b7e67646688f68f4b0504",
    "status": "registered",
    "bid_amount": 1000,
    "claimHeight": 41617,
    "spacesHistoryId": 732,
    "createdAt": "2024-10-02T20:52:19.805Z",
    "updatedAt": "2024-10-02T20:52:29.562Z",
    "rank": "188",
    "history": [
      {
        "id": 524,
        "action": "bid",
        "bid_amount": 1000,
        "transaction": {
          "id": 708,
          "txid": "36bfe212f60b94c7c20e93a98303ce5b86fc4c5954da9aa96cc63baeede6edb5",
          "block": {
            "time": 1723932235
          }
        }
      },
      {
        "id": 544,
        "action": "rollout",
        "bid_amount": null,
        "transaction": {
          "id": 729,
          "txid": "ed5fbad05e3c895cb4e183b1df94ec6928bad102c4ad689f7cc339bac8def4de",
          "block": {
            "time": 1723994427
          }
        }
      },
      {
        "id": 732,
        "action": "transfer",
        "bid_amount": null,
        "transaction": {
          "id": 945,
          "txid": "9f60496ae4992844794e7afd53fd9b7f6ae51fae72482f38cd46783a0bae1a5e",
          "block": {
            "time": 1724985490
          }
        }
      }
    ]
  },
  {
    "id": 302,
    "name": "@food",
    "nameSha256": "d3e5ab334ecacba150fe2d4d95ef8845897701bf8d2fa14f90abd730fa36faf8",
    "status": "registered",
    "bid_amount": 1000,
    "claimHeight": 43489,
    "spacesHistoryId": 976,
    "createdAt": "2024-10-02T20:52:29.562Z",
    "updatedAt": "2024-10-07T15:39:00.891Z",
    "rank": "189",
    "history": [
      {
        "id": 736,
        "action": "bid",
        "bid_amount": 1000,
        "transaction": {
          "id": 950,
          "txid": "9e1b291c74ec43df551eb1b1f634eea64ef1e8df4e501131f84175e08b8682cb",
          "block": {
            "time": 1724985490
          }
        }
      },
      {
        "id": 773,
        "action": "rollout",
        "bid_amount": null,
        "transaction": {
          "id": 980,
          "txid": "a597bd6da3574cba043c317748ecab5bd64534c5daffa78a5e7f8ac0e7403bd9",
          "block": {
            "time": 1725089125
          }
        }
      },
      {
        "id": 976,
        "action": "transfer",
        "bid_amount": null,
        "transaction": {
          "id": 1301,
          "txid": "11f9ff3eb2a349c438f9a68b615c234a13f478a2e284f90aaa93715834c44520",
          "block": {
            "time": 1728322721
          }
        }
      }
    ]
  },
  {
    "id": 380,
    "name": "@out",
    "nameSha256": "d743d01f7d56dcd472309fe4b8866a0f808def902c30bb8753a2c5b5325c71d4",
    "status": "auction",
    "bid_amount": 1000,
    "claimHeight": 50833,
    "spacesHistoryId": 1043,
    "createdAt": "2024-10-08T16:32:00.211Z",
    "updatedAt": "2024-10-10T05:23:00.074Z",
    "rank": "190",
    "history": [
      {
        "id": 1020,
        "action": "bid",
        "bid_amount": 1000,
        "transaction": {
          "id": 1355,
          "txid": "92693d7f26b96d75b1e5c69f4dd6ce81be9e9bd5214ce298840cf9bc500914e5",
          "block": {
            "time": 1728412271
          }
        }
      },
      {
        "id": 1043,
        "action": "rollout",
        "bid_amount": null,
        "transaction": {
          "id": 1375,
          "txid": "62fc9c12df7532ea2e099642b0e3803c00ba3abd96ea9e7e21c85e8e5552cabb",
          "block": {
            "time": 1728544952
          }
        }
      }
    ]
  },
  {
    "id": 345,
    "name": "@idk",
    "nameSha256": "dd695ad7cd6f59e78f4c288b3dcae271e5492180f4665128a232bd02041537a1",
    "status": "auction",
    "bid_amount": 1000,
    "claimHeight": 50113,
    "spacesHistoryId": 912,
    "createdAt": "2024-10-04T17:54:00.979Z",
    "updatedAt": "2024-10-05T03:03:00.277Z",
    "rank": "191",
    "history": [
      {
        "id": 911,
        "action": "bid",
        "bid_amount": 1000,
        "transaction": {
          "id": 1216,
          "txid": "29f19967452da180428e00d3202157f2ca2181a9b17eff493363052460ccaf95",
          "block": {
            "time": 1728071629
          }
        }
      },
      {
        "id": 912,
        "action": "rollout",
        "bid_amount": null,
        "transaction": {
          "id": 1217,
          "txid": "6bb8f6f46ea6b6b49d065c56620524ca6c57e1b24ffa652a6b00da3ba29cc455",
          "block": {
            "time": 1728104542
          }
        }
      }
    ]
  },
  {
    "id": 287,
    "name": "@bacon",
    "nameSha256": "e34b5f74d35d9634c48c5e7260f71a81b1ce7654ad115dfa5fb688da3b2dabda",
    "status": "registered",
    "bid_amount": 1000,
    "claimHeight": 43345,
    "spacesHistoryId": 968,
    "createdAt": "2024-10-02T20:52:29.427Z",
    "updatedAt": "2024-10-07T15:39:00.891Z",
    "rank": "192",
    "history": [
      {
        "id": 700,
        "action": "bid",
        "bid_amount": 1000,
        "transaction": {
          "id": 898,
          "txid": "9870f1f71bdde2834df4c3eadb1822d8cf26800f37e23b54cacae76d26af5c6f",
          "block": {
            "time": 1724985721
          }
        }
      },
      {
        "id": 753,
        "action": "rollout",
        "bid_amount": null,
        "transaction": {
          "id": 966,
          "txid": "4e0e6fa469456a7030468269b8fd988e32c8f5cc888ce00120fa36a92d787cd0",
          "block": {
            "time": 1725027352
          }
        }
      },
      {
        "id": 968,
        "action": "transfer",
        "bid_amount": null,
        "transaction": {
          "id": 1293,
          "txid": "852a2a0f6c23bdce0afb03226bec9cf2acacaa7b968058a82d69a357fb37ce53",
          "block": {
            "time": 1728322721
          }
        }
      }
    ]
  },
  {
    "id": 194,
    "name": "@go",
    "nameSha256": "e36a82c003e0c2dfcc2a54dddb582ae681093383f56f440ae634a07424c8929d",
    "status": "registered",
    "bid_amount": 1000,
    "claimHeight": 42481,
    "spacesHistoryId": 884,
    "createdAt": "2024-10-02T20:52:19.419Z",
    "updatedAt": "2024-10-02T20:52:34.413Z",
    "rank": "193",
    "history": [
      {
        "id": 492,
        "action": "bid",
        "bid_amount": 1000,
        "transaction": {
          "id": 662,
          "txid": "4971927f2b50aae85f5ca63ef22b19bf1a9583676c3b2c75be28a5f6f5ffcf12",
          "block": {
            "time": 1723908277
          }
        }
      },
      {
        "id": 655,
        "action": "rollout",
        "bid_amount": null,
        "transaction": {
          "id": 838,
          "txid": "a13b8ed005f9abfc95498f1ad20d89b3c0e8908f3698dde0d334effa39b5a55d",
          "block": {
            "time": 1724530590
          }
        }
      },
      {
        "id": 884,
        "action": "transfer",
        "bid_amount": null,
        "transaction": {
          "id": 1108,
          "txid": "445c1ecf04cb5d3330a3c5a0ceab9347b5a77557f7beaaf3df26419e530f91d6",
          "block": {
            "time": 1725541244
          }
        }
      }
    ]
  },
  {
    "id": 381,
    "name": "@at",
    "nameSha256": "e7dd91006932e92dbd62ec30db598f6d4708160460e9e207bf350c60c0c36f37",
    "status": "auction",
    "bid_amount": 1000,
    "claimHeight": 50833,
    "spacesHistoryId": 1045,
    "createdAt": "2024-10-08T16:32:00.211Z",
    "updatedAt": "2024-10-10T05:23:00.074Z",
    "rank": "194",
    "history": [
      {
        "id": 1021,
        "action": "bid",
        "bid_amount": 1000,
        "transaction": {
          "id": 1357,
          "txid": "6b3ff026f6a724047b4256fb68c3ab8833cb7586a0fa4b3c05f1b6ecafa7dec9",
          "block": {
            "time": 1728412271
          }
        }
      },
      {
        "id": 1045,
        "action": "rollout",
        "bid_amount": null,
        "transaction": {
          "id": 1375,
          "txid": "62fc9c12df7532ea2e099642b0e3803c00ba3abd96ea9e7e21c85e8e5552cabb",
          "block": {
            "time": 1728544952
          }
        }
      }
    ]
  },
  {
    "id": 212,
    "name": "@saturn",
    "nameSha256": "e97b4b5f4325bb377ffdd0c4647dc2de46d8e7d0a06d8e1eead24fa977cd991a",
    "status": "registered",
    "bid_amount": 1000,
    "claimHeight": 41905,
    "spacesHistoryId": 762,
    "createdAt": "2024-10-02T20:52:19.805Z",
    "updatedAt": "2024-10-02T20:52:30.684Z",
    "rank": "195",
    "history": [
      {
        "id": 520,
        "action": "bid",
        "bid_amount": 1000,
        "transaction": {
          "id": 700,
          "txid": "c23851a97c9ef620e57366cafa7985a343464cb78736771db10be5492ab62c03",
          "block": {
            "time": 1723932235
          }
        }
      },
      {
        "id": 572,
        "action": "rollout",
        "bid_amount": null,
        "transaction": {
          "id": 761,
          "txid": "36a384a9080e8f1f5a301919a064cf2725e2d59f886caa88ab697e1f9446788d",
          "block": {
            "time": 1724162284
          }
        }
      },
      {
        "id": 762,
        "action": "transfer",
        "bid_amount": null,
        "transaction": {
          "id": 975,
          "txid": "5fcfc1552f71ef70f1df6f497846481914b87614861b619192a6066713c8aaa5",
          "block": {
            "time": 1725071514
          }
        }
      }
    ]
  },
  {
    "id": 357,
    "name": "@g",
    "nameSha256": "e97cf1235a3801877673bc244e1a7d28d54167d87b5d26c9c2dfd314ccd8bbef",
    "status": "auction",
    "bid_amount": 1000,
    "claimHeight": 50545,
    "spacesHistoryId": 996,
    "createdAt": "2024-10-07T14:56:00.373Z",
    "updatedAt": "2024-10-08T04:29:00.197Z",
    "rank": "196",
    "history": [
      {
        "id": 948,
        "action": "bid",
        "bid_amount": 1000,
        "transaction": {
          "id": 1269,
          "txid": "b4959f38fd5ec9b69327dfde9fcb39734e37a4efbbf5b404b80df0014442d333",
          "block": {
            "time": 1728315456
          }
        }
      },
      {
        "id": 996,
        "action": "rollout",
        "bid_amount": null,
        "transaction": {
          "id": 1313,
          "txid": "dfc5fedf742b14271ccda5c80e42d7cf649a00f21ee26e2ce755434f02d2e4c4",
          "block": {
            "time": 1728368724
          }
        }
      }
    ]
  },
  {
    "id": 343,
    "name": "@meet",
    "nameSha256": "e98e34d48aa6b77b675a4811daf5c579cbcf59d184e63abd51c165d797dcd81c",
    "status": "registered",
    "bid_amount": 1000,
    "claimHeight": 44209,
    "spacesHistoryId": 934,
    "createdAt": "2024-10-02T20:52:34.413Z",
    "updatedAt": "2024-10-07T14:42:00.815Z",
    "rank": "197",
    "history": [
      {
        "id": 877,
        "action": "bid",
        "bid_amount": 1000,
        "transaction": {
          "id": 1094,
          "txid": "eb3cc1dfa71d21d59f9b7a8921b14f528563c3433e48a76f895a0fd554d0ecdc",
          "block": {
            "time": 1725541244
          }
        }
      },
      {
        "id": 897,
        "action": "rollout",
        "bid_amount": null,
        "transaction": {
          "id": 1163,
          "txid": "bdbf6d1820f81455ffe142efeb5568b4f6ce9b82a769bbe32a053832e8bfdc10",
          "block": {
            "time": 1725583181
          }
        }
      },
      {
        "id": 934,
        "action": "transfer",
        "bid_amount": null,
        "transaction": {
          "id": 1243,
          "txid": "7e7b6484cfe9ee27cda7e4b0f07e63759fc4c8eae6ecda8be228cb50c4a0f8ad",
          "block": {
            "time": 1728319307
          }
        }
      }
    ]
  },
  {
    "id": 213,
    "name": "@mercury",
    "nameSha256": "e9986ef45b0d79bef77ce833ffb7e026d2999f01b4cce4b180080f6536ab2fbd",
    "status": "registered",
    "bid_amount": 1000,
    "claimHeight": 41617,
    "spacesHistoryId": 694,
    "createdAt": "2024-10-02T20:52:19.805Z",
    "updatedAt": "2024-10-02T20:52:29.398Z",
    "rank": "198",
    "history": [
      {
        "id": 521,
        "action": "bid",
        "bid_amount": 1000,
        "transaction": {
          "id": 702,
          "txid": "e31ccb671791730c4e280cf3b8e66b679056771a8666e01026f2c25f19f16114",
          "block": {
            "time": 1723932235
          }
        }
      },
      {
        "id": 543,
        "action": "rollout",
        "bid_amount": null,
        "transaction": {
          "id": 729,
          "txid": "ed5fbad05e3c895cb4e183b1df94ec6928bad102c4ad689f7cc339bac8def4de",
          "block": {
            "time": 1723994427
          }
        }
      },
      {
        "id": 694,
        "action": "transfer",
        "bid_amount": null,
        "transaction": {
          "id": 891,
          "txid": "26911e967f8f18f956f0dca223647445afaf335cbbad6bcb342b7eaef632a236",
          "block": {
            "time": 1724984520
          }
        }
      }
    ]
  },
  {
    "id": 337,
    "name": "@not",
    "nameSha256": "ebef62149652d5ef620504a34931555889a8058a083f1a48dcf3991c25541ef8",
    "status": "registered",
    "bid_amount": 1000,
    "claimHeight": 44209,
    "spacesHistoryId": 935,
    "createdAt": "2024-10-02T20:52:34.413Z",
    "updatedAt": "2024-10-07T14:42:00.815Z",
    "rank": "199",
    "history": [
      {
        "id": 863,
        "action": "bid",
        "bid_amount": 1000,
        "transaction": {
          "id": 1073,
          "txid": "1bc54b6a482d15145ff3d7fcb6964fc43dc9002d070838aa1e59bfe6c41e522e",
          "block": {
            "time": 1725541244
          }
        }
      },
      {
        "id": 896,
        "action": "rollout",
        "bid_amount": null,
        "transaction": {
          "id": 1163,
          "txid": "bdbf6d1820f81455ffe142efeb5568b4f6ce9b82a769bbe32a053832e8bfdc10",
          "block": {
            "time": 1725583181
          }
        }
      },
      {
        "id": 935,
        "action": "transfer",
        "bid_amount": null,
        "transaction": {
          "id": 1244,
          "txid": "f41dbdb2e25dc47eec604b12b753edb49c87b5455430b7e99986c768957c6b35",
          "block": {
            "time": 1728319307
          }
        }
      }
    ]
  },
  {
    "id": 329,
    "name": "@mc",
    "nameSha256": "ee34920b8ac708e2e3fbf2186343251b14ffc79cfdaac8bfd2d56ab3dbd260c1",
    "status": "registered",
    "bid_amount": 1000,
    "claimHeight": 43777,
    "spacesHistoryId": 920,
    "createdAt": "2024-10-02T20:52:31.758Z",
    "updatedAt": "2024-10-07T14:22:00.127Z",
    "rank": "200",
    "history": [
      {
        "id": 805,
        "action": "bid",
        "bid_amount": 1000,
        "transaction": {
          "id": 1030,
          "txid": "1ab88ad6d55e9ceee683b7dfcdd3e760f566089094bff583c3bb935999cc14b8",
          "block": {
            "time": 1725154762
          }
        }
      },
      {
        "id": 822,
        "action": "rollout",
        "bid_amount": null,
        "transaction": {
          "id": 1043,
          "txid": "6d3e3777b3aaef22cbe5374c1dd946f59fff9821e182ee09bec3ae5a3a855205",
          "block": {
            "time": 1725381834
          }
        }
      },
      {
        "id": 920,
        "action": "transfer",
        "bid_amount": null,
        "transaction": {
          "id": 1229,
          "txid": "39cf73a268f6b776a9bc3b02c25927e34446c6d22e5d554e9642c0cd6efff94d",
          "block": {
            "time": 1728314204
          }
        }
      }
    ]
  },
  {
    "id": 323,
    "name": "@enjoy",
    "nameSha256": "efad62261ffd97e275eac2f3ff5321d848a5e7329c301d477f66493dde1140d3",
    "status": "registered",
    "bid_amount": 1000,
    "claimHeight": 43921,
    "spacesHistoryId": 925,
    "createdAt": "2024-10-02T20:52:31.388Z",
    "updatedAt": "2024-10-07T14:22:00.127Z",
    "rank": "201",
    "history": [
      {
        "id": 799,
        "action": "bid",
        "bid_amount": 1000,
        "transaction": {
          "id": 1017,
          "txid": "9e187a50a8c367031af753fdd51f770a31b38d53c6b52c1aea1c90c07429bfb2",
          "block": {
            "time": 1725121917
          }
        }
      },
      {
        "id": 832,
        "action": "rollout",
        "bid_amount": null,
        "transaction": {
          "id": 1044,
          "txid": "39c2aa36c7f805af0f9dd249a1737169be1defe5f0a69da9007f7df9f521526b",
          "block": {
            "time": 1725450337
          }
        }
      },
      {
        "id": 925,
        "action": "transfer",
        "bid_amount": null,
        "transaction": {
          "id": 1234,
          "txid": "df4fb0349e94f2fcae41b25365df82c521b064821e4cf9b4541dc8c97919b2f3",
          "block": {
            "time": 1728314204
          }
        }
      }
    ]
  },
  {
    "id": 242,
    "name": "@silver",
    "nameSha256": "f52c70bf8538f8c00292ba96be34734b6d2d3beecfc424c4dfa51ed5d1dbf935",
    "status": "registered",
    "bid_amount": 1000,
    "claimHeight": 42193,
    "spacesHistoryId": 844,
    "createdAt": "2024-10-02T20:52:22.136Z",
    "updatedAt": "2024-10-02T20:52:34.112Z",
    "rank": "202",
    "history": [
      {
        "id": 584,
        "action": "bid",
        "bid_amount": 1000,
        "transaction": {
          "id": 771,
          "txid": "9131582c47d8ddfc7ed9f7bd0479ed3cfc5451143c458429f68d6c7c49f95e80",
          "block": {
            "time": 1724163404
          }
        }
      },
      {
        "id": 619,
        "action": "rollout",
        "bid_amount": null,
        "transaction": {
          "id": 816,
          "txid": "7af1e824358c2644ef73e4e1ebde8d2fe27ed5ee4af29dc068bc723080ccbb1d",
          "block": {
            "time": 1724329893
          }
        }
      },
      {
        "id": 844,
        "action": "transfer",
        "bid_amount": null,
        "transaction": {
          "id": 1051,
          "txid": "45b98c4d91d2fd5b27d183224169a7090479d1835e6489d597795423840a491a",
          "block": {
            "time": 1725520217
          }
        }
      }
    ]
  },
  {
    "id": 228,
    "name": "@leaf",
    "nameSha256": "f576056b827e56f8acca7c00c18c3bea0b416218860a4c55a245f9f4b97ec29e",
    "status": "registered",
    "bid_amount": 1000,
    "claimHeight": 41761,
    "spacesHistoryId": 720,
    "createdAt": "2024-10-02T20:52:20.865Z",
    "updatedAt": "2024-10-02T20:52:29.562Z",
    "rank": "203",
    "history": [
      {
        "id": 546,
        "action": "bid",
        "bid_amount": 1000,
        "transaction": {
          "id": 733,
          "txid": "12cb60381c1b7f257ddf764a027ad79cdee1abaddef30fd96e90b0205ac67005",
          "block": {
            "time": 1724033718
          }
        }
      },
      {
        "id": 559,
        "action": "rollout",
        "bid_amount": null,
        "transaction": {
          "id": 750,
          "txid": "ba0c795e2fad7da5562a80ebfb4909d27eb2c7e8809f9c79becc339272845979",
          "block": {
            "time": 1724077177
          }
        }
      },
      {
        "id": 720,
        "action": "transfer",
        "bid_amount": null,
        "transaction": {
          "id": 933,
          "txid": "5142ea4df5b0b89b1565106e54ebe4c87d3335a008c2e0e1e2878062ac888e03",
          "block": {
            "time": 1724985490
          }
        }
      }
    ]
  },
  {
    "id": 313,
    "name": "@dial",
    "nameSha256": "f70d5ba0a1caf12574f879648bace024730d81cb1c82630b917d1b0cef543e38",
    "status": "registered",
    "bid_amount": 1000,
    "claimHeight": 43633,
    "spacesHistoryId": 985,
    "createdAt": "2024-10-02T20:52:31.388Z",
    "updatedAt": "2024-10-07T15:39:00.891Z",
    "rank": "204",
    "history": [
      {
        "id": 789,
        "action": "bid",
        "bid_amount": 1000,
        "transaction": {
          "id": 997,
          "txid": "c4a535df4bf2e99835b166ae10fcbc0193981cd02e4ddecd1f86ab55f03cad10",
          "block": {
            "time": 1725121917
          }
        }
      },
      {
        "id": 816,
        "action": "rollout",
        "bid_amount": null,
        "transaction": {
          "id": 1041,
          "txid": "df17732535dbf2580795415b751e95e2b94633d0ee623f2883458e1587d5936f",
          "block": {
            "time": 1725168709
          }
        }
      },
      {
        "id": 985,
        "action": "transfer",
        "bid_amount": null,
        "transaction": {
          "id": 1310,
          "txid": "89f203e1b1a2332110ff25d3d173de41ba86e01a2301b2cb5a713c12814081f8",
          "block": {
            "time": 1728322721
          }
        }
      }
    ]
  },
  {
    "id": 336,
    "name": "@act",
    "nameSha256": "f76e2803cb3ab6d48b785b70c7ef1e226fb14ea42dcbe17e203957866481955e",
    "status": "registered",
    "bid_amount": 1000,
    "claimHeight": 44065,
    "spacesHistoryId": 929,
    "createdAt": "2024-10-02T20:52:34.112Z",
    "updatedAt": "2024-10-07T14:42:00.815Z",
    "rank": "205",
    "history": [
      {
        "id": 860,
        "action": "bid",
        "bid_amount": 1000,
        "transaction": {
          "id": 1069,
          "txid": "d988a67dde9ab0be552cf0aa5ddba6185e7d053e1dda215716c93c271d806866",
          "block": {
            "time": 1725520217
          }
        }
      },
      {
        "id": 861,
        "action": "rollout",
        "bid_amount": null,
        "transaction": {
          "id": 1071,
          "txid": "bb26e001776d28a9276106874dde7dde7ee07fe2d50bc2a4122d08d2761dbbc4",
          "block": {
            "time": 1725521932
          }
        }
      },
      {
        "id": 929,
        "action": "transfer",
        "bid_amount": null,
        "transaction": {
          "id": 1238,
          "txid": "f82ac78406c6f5b84bfe8e8a31083a3ac2ff7d7112a61d2750e12ab09781f554",
          "block": {
            "time": 1728319307
          }
        }
      }
    ]
  },
  {
    "id": 401,
    "name": "@mytest12",
    "nameSha256": "f77df97dd120fe1632b226a0cac55f814813c1def86eb490419b2d83cd899d9c",
    "status": "auction",
    "bid_amount": 1000,
    "claimHeight": 52417,
    "spacesHistoryId": 1083,
    "createdAt": "2024-10-19T12:42:00.206Z",
    "updatedAt": "2024-10-20T05:45:00.521Z",
    "rank": "206",
    "history": [
      {
        "id": 1075,
        "action": "bid",
        "bid_amount": 1000,
        "transaction": {
          "id": 1409,
          "txid": "8ad900ff3e4000abe430ab4e45bae48ad615eca1d3a2c5bd59dae5bd5dacdd42",
          "block": {
            "time": 1729341684
          }
        }
      },
      {
        "id": 1083,
        "action": "rollout",
        "bid_amount": null,
        "transaction": {
          "id": 1416,
          "txid": "72cc2548c188250668d98cdd0e48b3333a01ebc33d305a4f5236423ca62b800f",
          "block": {
            "time": 1729403090
          }
        }
      }
    ]
  },
  {
    "id": 256,
    "name": "@kick",
    "nameSha256": "f838a93adb8bc85167fd70f7b4dfb08d4cdd8a6bcf99c6fce15e4519985ba3e8",
    "status": "registered",
    "bid_amount": 1000,
    "claimHeight": 42049,
    "spacesHistoryId": 786,
    "createdAt": "2024-10-02T20:52:22.915Z",
    "updatedAt": "2024-10-02T20:52:31.319Z",
    "rank": "207",
    "history": [
      {
        "id": 599,
        "action": "bid",
        "bid_amount": 1000,
        "transaction": {
          "id": 800,
          "txid": "3ec22118f5bf79689cf2443a9dce2672579b591ed73cf483e7a035de0be8686f",
          "block": {
            "time": 1724251887
          }
        }
      },
      {
        "id": 608,
        "action": "rollout",
        "bid_amount": null,
        "transaction": {
          "id": 811,
          "txid": "b38f1a9aaa4ce4be5112ca50fe181b7880b1f8474c052a8662881295c38d0be3",
          "block": {
            "time": 1724255932
          }
        }
      },
      {
        "id": 786,
        "action": "transfer",
        "bid_amount": null,
        "transaction": {
          "id": 990,
          "txid": "da62a29862923f54d73a0d7e6d80963f92c8154957c372fb9d0cc2586c22186a",
          "block": {
            "time": 1725118410
          }
        }
      }
    ]
  },
  {
    "id": 272,
    "name": "@tiger",
    "nameSha256": "f8d64ff55d996c05e888870e3f2dfcc9025b7687ba2e4f454e25832634fdd8c9",
    "status": "registered",
    "bid_amount": 1000,
    "claimHeight": 42337,
    "spacesHistoryId": 857,
    "createdAt": "2024-10-02T20:52:24.475Z",
    "updatedAt": "2024-10-02T20:52:34.112Z",
    "rank": "208",
    "history": [
      {
        "id": 635,
        "action": "bid",
        "bid_amount": 1000,
        "transaction": {
          "id": 834,
          "txid": "d605923d399efc46a68b7afe7a7a925ca49b564329c4eec0aeca7d4ed9b6ac83",
          "block": {
            "time": 1724419385
          }
        }
      },
      {
        "id": 641,
        "action": "rollout",
        "bid_amount": null,
        "transaction": {
          "id": 837,
          "txid": "13775265c5051319c78d5e8397534cc6a0863912e3103bffa7c8d36e48e11813",
          "block": {
            "time": 1724436541
          }
        }
      },
      {
        "id": 857,
        "action": "transfer",
        "bid_amount": null,
        "transaction": {
          "id": 1064,
          "txid": "e4476ebb17ffdeaaaad4aaed9858b7951829421c8a3d25c11b090ed89ed0e1f5",
          "block": {
            "time": 1725520217
          }
        }
      }
    ]
  },
  {
    "id": 359,
    "name": "@k",
    "nameSha256": "f98b493f1f2271f597900810893c6c01ce9ed84143bf989f17af66fb19470de5",
    "status": "auction",
    "bid_amount": 1000,
    "claimHeight": 50977,
    "spacesHistoryId": 1056,
    "createdAt": "2024-10-07T14:56:00.373Z",
    "updatedAt": "2024-10-10T15:40:00.396Z",
    "rank": "209",
    "history": [
      {
        "id": 950,
        "action": "bid",
        "bid_amount": 1000,
        "transaction": {
          "id": 1273,
          "txid": "77272d76775695ec62c7d6f4436a8da6f260ac7917c6c46c5c6b9ce209c1cdf3",
          "block": {
            "time": 1728315456
          }
        }
      },
      {
        "id": 1056,
        "action": "rollout",
        "bid_amount": null,
        "transaction": {
          "id": 1376,
          "txid": "1e46c34f547fb79f68cc297c6c5974acba4d5ad2f99297053c325f718f456a12",
          "block": {
            "time": 1728578686
          }
        }
      }
    ]
  },
  {
    "id": 305,
    "name": "@control",
    "nameSha256": "fa7dccefdc3aa74b15947b44c1174a1d95b88462a472bc641eae25e9fde3d3c0",
    "status": "registered",
    "bid_amount": 1000,
    "claimHeight": 43345,
    "spacesHistoryId": 959,
    "createdAt": "2024-10-02T20:52:29.635Z",
    "updatedAt": "2024-10-07T14:56:00.373Z",
    "rank": "210",
    "history": [
      {
        "id": 740,
        "action": "bid",
        "bid_amount": 1000,
        "transaction": {
          "id": 957,
          "txid": "4b272855b0d156efaca8b5f5f25ba98ede93074dc348faf28e02027bfcd86bc7",
          "block": {
            "time": 1724987894
          }
        }
      },
      {
        "id": 751,
        "action": "rollout",
        "bid_amount": null,
        "transaction": {
          "id": 966,
          "txid": "4e0e6fa469456a7030468269b8fd988e32c8f5cc888ce00120fa36a92d787cd0",
          "block": {
            "time": 1725027352
          }
        }
      },
      {
        "id": 959,
        "action": "transfer",
        "bid_amount": null,
        "transaction": {
          "id": 1284,
          "txid": "ebe8939207acf6631778e0ac58a5deaee3b12e335f7bf75684d153065a71915d",
          "block": {
            "time": 1728315456
          }
        }
      }
    ]
  },
  {
    "id": 255,
    "name": "@cloud",
    "nameSha256": "fc13158791a17863e3c45679d0e643500ef34df9868471f52ec36d2bbe23089b",
    "status": "registered",
    "bid_amount": 1000,
    "claimHeight": 42049,
    "spacesHistoryId": 779,
    "createdAt": "2024-10-02T20:52:22.915Z",
    "updatedAt": "2024-10-02T20:52:31.319Z",
    "rank": "211",
    "history": [
      {
        "id": 598,
        "action": "bid",
        "bid_amount": 1000,
        "transaction": {
          "id": 798,
          "txid": "f02f899ed6e929e239dcafd2973206d0cd66287a70d5299d4c728343861ba541",
          "block": {
            "time": 1724251887
          }
        }
      },
      {
        "id": 614,
        "action": "rollout",
        "bid_amount": null,
        "transaction": {
          "id": 811,
          "txid": "b38f1a9aaa4ce4be5112ca50fe181b7880b1f8474c052a8662881295c38d0be3",
          "block": {
            "time": 1724255932
          }
        }
      },
      {
        "id": 779,
        "action": "transfer",
        "bid_amount": null,
        "transaction": {
          "id": 983,
          "txid": "1688997968740b1b3afede355dd2eeaafd0ac0ea2afcf33c9a768d1d15892c1a",
          "block": {
            "time": 1725118410
          }
        }
      }
    ]
  },
  {
    "id": 364,
    "name": "@first",
    "nameSha256": "fd849eebdcdcc83bff939a8d7b8061c76c644bc79d1ddf69d20ee853265f97cc",
    "status": "auction",
    "bid_amount": 1000,
    "claimHeight": 50689,
    "spacesHistoryId": 1033,
    "createdAt": "2024-10-08T15:51:00.726Z",
    "updatedAt": "2024-10-09T01:13:00.537Z",
    "rank": "212",
    "history": [
      {
        "id": 1004,
        "action": "bid",
        "bid_amount": 1000,
        "transaction": {
          "id": 1331,
          "txid": "b4b47c231ccc1c3c9fdac93ee07e6dc885ad9baa14750983447bcd97be88e265",
          "block": {
            "time": 1728409829
          }
        }
      },
      {
        "id": 1033,
        "action": "rollout",
        "bid_amount": null,
        "transaction": {
          "id": 1374,
          "txid": "01797a10e75cc91a87eccf99e01a59f203c9a6f720b9d30122590b355bd5da10",
          "block": {
            "time": 1728441324
          }
        }
      }
    ]
  },
  {
    "id": 374,
    "name": "@pine",
    "nameSha256": "fdd5c072d91f23d75086a1efd72afe1c32397fecf793aefdebb2716256721cc2",
    "status": "auction",
    "bid_amount": 1000,
    "claimHeight": 50689,
    "spacesHistoryId": 1035,
    "createdAt": "2024-10-08T15:55:00.897Z",
    "updatedAt": "2024-10-09T01:13:00.537Z",
    "rank": "213",
    "history": [
      {
        "id": 1014,
        "action": "bid",
        "bid_amount": 1000,
        "transaction": {
          "id": 1344,
          "txid": "fa657a3514238887c3461cdddfcb5f9094e40763d23cb970cad8947e12c2dc25",
          "block": {
            "time": 1728403843
          }
        }
      },
      {
        "id": 1035,
        "action": "rollout",
        "bid_amount": null,
        "transaction": {
          "id": 1374,
          "txid": "01797a10e75cc91a87eccf99e01a59f203c9a6f720b9d30122590b355bd5da10",
          "block": {
            "time": 1728441324
          }
        }
      }
    ]
  },
  {
    "id": 244,
    "name": "@face",
    "nameSha256": "fed34fe08c8dcd51783a93dde568302ad3eba451a2afbc85533f6825e3c77540",
    "status": "registered",
    "bid_amount": 1000,
    "claimHeight": 42193,
    "spacesHistoryId": 848,
    "createdAt": "2024-10-02T20:52:22.224Z",
    "updatedAt": "2024-10-02T20:52:34.112Z",
    "rank": "214",
    "history": [
      {
        "id": 586,
        "action": "bid",
        "bid_amount": 1000,
        "transaction": {
          "id": 775,
          "txid": "556b9627ef0bd1d3b1e704f01be776287d8f99c534ac4b392a5bdcfa580e1e3a",
          "block": {
            "time": 1724163469
          }
        }
      },
      {
        "id": 618,
        "action": "rollout",
        "bid_amount": null,
        "transaction": {
          "id": 816,
          "txid": "7af1e824358c2644ef73e4e1ebde8d2fe27ed5ee4af29dc068bc723080ccbb1d",
          "block": {
            "time": 1724329893
          }
        }
      },
      {
        "id": 848,
        "action": "transfer",
        "bid_amount": null,
        "transaction": {
          "id": 1055,
          "txid": "f5a4d9d518cc2aed3fa6a7713aaf68c277466ec17f565f3d1aa76b08e96144fb",
          "block": {
            "time": 1725520217
          }
        }
      }
    ]
  }
]

    // if (sortBy == 'ending') {
    //     orderBy = sql`case when ${spaces.claimHeight} > (select block_height from ${blockStats}) then 1 else 2 end, ${spaces.claimHeight}`
    // } else if (sortBy == 'price') {
    //     orderBy = [direction === 'desc' ? desc(spaces.bid_amount) : asc(spaces.bid_amount)];
    // } else if (sortBy == 'register_date') {
    //     orderBy = [direction === 'desc' ? desc(spaces.spacesHistoryId) : asc(spaces.spacesHistoryId)];
    // }

const latestVmetaouts = await db.query.vmetaouts.findMany({
    limit: 5,
    // with: {
    //     blocks: true
    // },
});
  //   blockHash: vmetaouts.block_hash,
  //   txid: vmetaouts.txid,
  //   txIndex: vmetaouts.tx_index,
  //   name: vmetaouts.name,
  //   covenantAction: vmetaouts.covenant_action,
  //   claimHeight: vmetaouts.claim_height,
  //   expireHeight: vmetaouts.expire_height,
  //   blockHeight: blocks.height
  // })
  // .from(vmetaouts)
  //
  // // .innerJoin(blocks, blocks.hash.eq(vmetaouts.block_hash))
  // // .orderBy(blocks.height.desc())
  // .limit(10);

    // const spacesDb = await db.query.vmetaouts.findMany({
    //     where: status ? sql`${vmetaouts.status} = ${status}`: sql`1=1`,
    //     extras: { rank: sql`dense_rank() over(order by ${spaces.bid_amount} desc, ${spaces.nameSha256})`.as('rank') },
    //     with: {
    //         history: {
    //             columns: { id: true, action: true, bid_amount: true },
    //             with: {
    //                 transaction: {
    //                     columns: { id: true, txid: true },
    //                     with: {
    //                         block: { columns: { time: true } }
    //                     }
    //                 }
    //             },
    //             orderBy: (history) =>  history.id,
    //         },
    //     },
    //     orderBy
    // });
// console.log(latestVmetaouts)
  return json(fakedata)
  // return json(latestVmetaouts ?? []);
    // return json(spacesDb ?? []);
}
