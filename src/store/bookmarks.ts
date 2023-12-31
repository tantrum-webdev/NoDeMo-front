import { fetcher, isNil } from '@/helpers/functions';
import { Bookmark, Maybe } from '@/types';
import { defineStore } from 'pinia';

type FetchedBookmarks = Record<'bookmarks', Array<Bookmark>>;
type MaybeBookmarks = Maybe<Array<Bookmark>>;

export const useBookmarkStore = defineStore('bookmarks', {
  state: () => {
    return {
      bookmarks: null as MaybeBookmarks,
      sharedBookmarks: null as MaybeBookmarks,
    };
  },

  actions: {
    getBookmarks(id: string) {
      fetcher<FetchedBookmarks>(`/bookmarks/${id}`).then(({ bookmarks }) => {
        if (bookmarks.length > 0) {
          this.bookmarks = bookmarks;
        }
      });
    },

    getSharedBookmarks(username: string) {
      fetcher<FetchedBookmarks>(`/shared/${username}`)
        .then(({ bookmarks }) => {
          if (bookmarks.length > 0) {
            this.sharedBookmarks = bookmarks;
          }
        })
        .catch(() => {
          this.router.push('/notfound');
        });
    },

    addBookmark(id: string, bookmarkUrl: string) {
      fetcher<Bookmark>(`/bookmarks/${id}`, {
        method: 'POST',
        body: JSON.stringify({ url: bookmarkUrl }),
      }).then((bookmark) => {
        if (isNil(this.bookmarks)) {
          this.bookmarks = [bookmark];
        }

        this.bookmarks = [...this.bookmarks, bookmark];
      });
    },

    clearSharedBookmarks() {
      this.sharedBookmarks = null;
    },
  },
});
