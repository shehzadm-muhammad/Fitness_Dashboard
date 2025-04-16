// src/utils/getBackgroundImage.js
export const getBackgroundImage = (pathname) => {
  switch (pathname) {
    case '/dashboard':
      return "url('https://images.unsplash.com/photo-1605296867304-46d5465a13f1?auto=format&fit=crop&w=1350&q=80')";
    case '/profile':
      return "url('https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')";
    case '/goals':
      return "url('https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=1350&q=80')";
    case '/signup':
      return "url('https://images.unsplash.com/photo-1607746882042-944635dfe10e?auto=format&fit=crop&w=1350&q=80')";
    default:
      return "url('https://images.unsplash.com/photo-1594737625785-cb9f408a5d3b?auto=format&fit=crop&w=1350&q=80')";
  }
};
