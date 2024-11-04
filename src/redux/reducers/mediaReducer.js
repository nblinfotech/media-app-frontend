// mediaReducer.js
import { FETCH_MEDIA, UPLOAD_MEDIA, UPDATE_SHARE_COUNT,INCREMENT_VIEW_COUNT } from '../actions/types';

const initialState = {
  mediaList: [],
  uploadProgress: 0,
};

const mediaReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_MEDIA:
      return { ...state, mediaList: action.payload };

    case UPLOAD_MEDIA:
      return { ...state, mediaList: [...state.mediaList, action.payload] };

    case UPDATE_SHARE_COUNT:
      return {
        ...state,
        mediaList: state.mediaList.map((item) =>
          item.id === action.payload.id ? { ...item, shareCount: action.payload.shareCount } : item
        ),
      };
      case INCREMENT_VIEW_COUNT:
      return {
        ...state,
        mediaList: state.mediaList.map((media) =>
          media.id === action.payload.mediaId ? { ...media, viewCount: action.payload.viewCount } : media
        ),
      };
    default:
      return state;
  }
};

export default mediaReducer;
