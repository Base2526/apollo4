import {
    UPDATED_PROFILE,
    LOGOUT,
    ADDED_CONVERSATIONS,
    ADDED_CONVERSATION,
    DELETED_CONVERSATION,
    ADDED_NOTIFICATIONS,
    ADDED_NOTIFICATION,
    ADDED_MESSAGES,
    ADDED_MESSAGE,
    EDITED_MESSAGE,
    DELETED_MESSAGE,
    ADDED_BOOKMARKS,
    ADDED_BOOKMARK,
    TERMS_AND_CONDITIONS,
    EDITED_USER_BALANCE,
    EDITED_USER_BALANCE_BOOK,
  } from "../../constants";
  
  import _ from "lodash";
  import { removeCookie } from "../../utils";
  
  interface User {
    [key: string]: any; // Adjust this type based on your user object structure
  }
  
  interface Conversation {
    _id: string;
    [key: string]: any; // Adjust this type based on your conversation object structure
  }
  
  interface Notification {
    _id: string;
    [key: string]: any; // Adjust this type based on your notification object structure
  }
  
  interface Message {
    _id: string;
    conversationId: string;
    [key: string]: any; // Adjust this type based on your message object structure
  }
  
  interface Bookmark {
    postId: string;
    userId: string;
    status?: string;
    [key: string]: any; // Adjust this type based on your bookmark object structure
  }
  
  interface AuthState {
    user: User;
    conversations: Conversation[];
    bookmarks: Bookmark[];
    messages: Message[];
    notifications: Notification[];
    terms_and_conditions: boolean;
  }
  
  interface Action {
    type: string;
    data?: any; // Adjust this type based on the action data structure
  }
  
  const initialState: AuthState = {
    user: {},
    conversations: [],
    bookmarks: [],
    messages: [],
    notifications: [],
    terms_and_conditions: false,
  };
  
  // const merge = (...lists: any[]) => {
  //   let key = "_id";
  //   return Object.values(
  //     lists.reduce((idx, list) => {
  //       list.forEach((record) => {
  //         if (idx[record[key]]) idx[record[key]] = Object.assign(idx[record[key]], record);
  //         else idx[record[key]] = record;
  //       });
  //       return idx;
  //     }, {})
  //   );
  // };

  interface MyRecord {
    _id: string;
    // Add other fields as needed
    [key: string]: any; // Index signature
  }
  
  const merge = (...lists: MyRecord[][]): MyRecord[] => {
    const key = "_id";
    return Object.values(
      lists.reduce((idx, list) => {
        list.forEach((record: MyRecord) => {
          // Assuming `_id` is always present in the record
          if (idx[record[key]]) {
            idx[record[key]] = Object.assign(idx[record[key]], record);
          } else {
            idx[record[key]] = record;
          }
        });
        return idx;
      }, {} as Record<string, MyRecord>) // Use Record<string, MyRecord> for the accumulator
    );
  };
  
  const auth = (state: AuthState = initialState, action: Action): AuthState => {
    switch (action.type) {
      case UPDATED_PROFILE: {
        if (_.isEqual(state.user, action.data)) {
          return state;
        } else {
          return { ...state, user: { ...state.user, ...action.data } };
        }
      }
  
      case LOGOUT: {
        localStorage.clear();
        removeCookie("usida");
        return { ...initialState, terms_and_conditions: state.terms_and_conditions };
      }
  
      case ADDED_CONVERSATIONS: {
        return { ...state, conversations: action.data };
      }
  
      case ADDED_CONVERSATION: {
        const { mutation, data } = action.data;
        let conversations = [...state.conversations];
        if (_.find(conversations, (c) => c._id === data._id)) {
          return { ...state, conversations: _.map(conversations, (c) => (c._id === data._id ? data : c)) };
        }
        switch (mutation) {
          case "CREATED":
          case "UPDATED": {
            conversations = [...conversations, data];
            break;
          }
        }
        return { ...state, conversations };
      }
  
      case DELETED_CONVERSATION: {
        const newConversations = _.filter(state.conversations, (m) => m._id !== action.data.id);
        const newMessages = _.filter(state.messages, (m) => m.conversationId !== action.data.id);
        return { ...state, conversations: newConversations, messages: newMessages };
      }
  
      case ADDED_NOTIFICATIONS: {
        return { ...state, notifications: action.data };
      }
  
      case ADDED_NOTIFICATION: {
        const { mutation, data } = action.data;
        let notifications = [...state.notifications];
        if (_.find(notifications, (c) => c._id === data._id)) {
          return { ...state, notifications: _.map(notifications, (c) => (c._id === data._id ? data : c)) };
        }
        switch (mutation) {
          case "CREATED":
          case "UPDATED": {
            notifications = [...notifications, data];
            break;
          }
        }
        return { ...state, notifications };
      }
  
      case ADDED_MESSAGES: {
        // return { ...state, messages: merge(state.messages, action.data) };
        return state;
      }
  
      case ADDED_MESSAGE: {
        const messages = [...state.messages, action.data];
        return { ...state, messages };
      }
  
      case EDITED_MESSAGE: {
        const newMessages = _.map(state.messages, (m) => (m._id === action.data.id ? action.data : m));
        return { ...state, messages: newMessages };
      }
  
      case DELETED_MESSAGE: {
        const newMessages = _.filter(state.messages, (m) => m._id !== action.data.id);
        return { ...state, messages: newMessages };
      }
  
      case ADDED_BOOKMARKS: {
        if (!_.isEqual(state.bookmarks, action.data)) {
          return { ...state, bookmarks: action.data };
        }
        return state;
      }
  
      case ADDED_BOOKMARK: {
        const { mutation, data } = action.data;
        let result: AuthState | null = null;
  
        if (_.isEmpty(mutation)) {
          let bookmarks = [...state.bookmarks];
          const bookmark = _.find(bookmarks, (bookmark) => bookmark.postId === data.postId && bookmark.userId === data.userId);
  
          if (_.isEmpty(bookmark)) {
            bookmarks = [...bookmarks, { ...data, local: true }];
            result = { ...state, bookmarks };
          } else {
            bookmarks = _.map(bookmarks, (bookmark) =>
              bookmark.postId === data.postId && bookmark.userId === data.userId
                ? { ...bookmark, status: data.status, local: true }
                : bookmark
            );
            result = { ...state, bookmarks };
          }
        }
  
        return result || state; // Ensure state is returned even if no changes were made
      }
  
      case TERMS_AND_CONDITIONS: {
        return { ...state, terms_and_conditions: action.data };
      }
  
      case EDITED_USER_BALANCE: {
        const { data } = action.data;
        return { ...state, user: { ...state.user, ...data } };
      }
  
      case EDITED_USER_BALANCE_BOOK: {
        const { data } = action.data;
        return { ...state, user: { ...state.user, ...data } };
      }
  
      default:
        return state;
    }
  };
  
  export default auth;
  