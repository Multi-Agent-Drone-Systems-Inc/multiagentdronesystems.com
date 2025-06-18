import { supabase } from './supabase';

export interface CartItem {
  id: string;
  user_id: string;
  drone_id: string;
  quantity: number;
  created_at: string;
  updated_at: string;
  drone: {
    id: string;
    name: string;
    image_url: string;
    price: number;
    in_stock: boolean;
  };
}

export interface WishlistItem {
  id: string;
  user_id: string;
  drone_id: string;
  created_at: string;
  drone: {
    id: string;
    name: string;
    image_url: string;
    price: number;
    in_stock: boolean;
  };
}

// Cart functions
export const addToCart = async (droneId: string, quantity: number = 1): Promise<{ success: boolean; error?: string }> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return { success: false, error: 'User not authenticated' };
    }

    // Check if item already exists in cart
    const { data: existingItem } = await supabase
      .from('cart_items')
      .select('*')
      .eq('user_id', user.id)
      .eq('drone_id', droneId)
      .single();

    if (existingItem) {
      // Update quantity if item exists
      const { error } = await supabase
        .from('cart_items')
        .update({ quantity: existingItem.quantity + quantity })
        .eq('id', existingItem.id);

      if (error) throw error;
    } else {
      // Insert new item
      const { error } = await supabase
        .from('cart_items')
        .insert([{
          user_id: user.id,
          drone_id: droneId,
          quantity
        }]);

      if (error) throw error;
    }

    return { success: true };
  } catch (error) {
    console.error('Error adding to cart:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
};

export const removeFromCart = async (cartItemId: string): Promise<{ success: boolean; error?: string }> => {
  try {
    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('id', cartItemId);

    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Error removing from cart:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
};

export const updateCartQuantity = async (cartItemId: string, quantity: number): Promise<{ success: boolean; error?: string }> => {
  try {
    if (quantity <= 0) {
      return removeFromCart(cartItemId);
    }

    const { error } = await supabase
      .from('cart_items')
      .update({ quantity })
      .eq('id', cartItemId);

    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Error updating cart quantity:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
};

export const getCartItems = async (): Promise<{ data: CartItem[]; error?: string }> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return { data: [], error: 'User not authenticated' };
    }

    const { data, error } = await supabase
      .from('cart_items')
      .select(`
        *,
        drone:droneslist (
          id,
          name,
          image_url,
          price,
          in_stock
        )
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return { data: data || [] };
  } catch (error) {
    console.error('Error fetching cart items:', error);
    return { data: [], error: error instanceof Error ? error.message : 'Unknown error' };
  }
};

// Wishlist functions
export const addToWishlist = async (droneId: string): Promise<{ success: boolean; error?: string }> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return { success: false, error: 'User not authenticated' };
    }

    // Check if item already exists in wishlist
    const { data: existingItem } = await supabase
      .from('wishlist_items')
      .select('*')
      .eq('user_id', user.id)
      .eq('drone_id', droneId)
      .single();

    if (existingItem) {
      return { success: false, error: 'Item already in wishlist' };
    }

    const { error } = await supabase
      .from('wishlist_items')
      .insert([{
        user_id: user.id,
        drone_id: droneId
      }]);

    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Error adding to wishlist:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
};

export const removeFromWishlist = async (wishlistItemId: string): Promise<{ success: boolean; error?: string }> => {
  try {
    const { error } = await supabase
      .from('wishlist_items')
      .delete()
      .eq('id', wishlistItemId);

    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Error removing from wishlist:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
};

export const getWishlistItems = async (): Promise<{ data: WishlistItem[]; error?: string }> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return { data: [], error: 'User not authenticated' };
    }

    const { data, error } = await supabase
      .from('wishlist_items')
      .select(`
        *,
        drone:droneslist (
          id,
          name,
          image_url,
          price,
          in_stock
        )
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return { data: data || [] };
  } catch (error) {
    console.error('Error fetching wishlist items:', error);
    return { data: [], error: error instanceof Error ? error.message : 'Unknown error' };
  }
};

// Move item from wishlist to cart (when item becomes available)
export const moveWishlistToCart = async (wishlistItemId: string, quantity: number = 1): Promise<{ success: boolean; error?: string }> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return { success: false, error: 'User not authenticated' };
    }

    // Get wishlist item
    const { data: wishlistItem, error: fetchError } = await supabase
      .from('wishlist_items')
      .select('drone_id')
      .eq('id', wishlistItemId)
      .eq('user_id', user.id)
      .single();

    if (fetchError || !wishlistItem) {
      return { success: false, error: 'Wishlist item not found' };
    }

    // Add to cart
    const cartResult = await addToCart(wishlistItem.drone_id, quantity);
    if (!cartResult.success) {
      return cartResult;
    }

    // Remove from wishlist
    const wishlistResult = await removeFromWishlist(wishlistItemId);
    if (!wishlistResult.success) {
      return wishlistResult;
    }

    return { success: true };
  } catch (error) {
    console.error('Error moving wishlist item to cart:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
};

// Check if drone is in cart
export const isDroneInCart = async (droneId: string): Promise<{ inCart: boolean; error?: string }> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return { inCart: false, error: 'User not authenticated' };
    }

    const { data, error } = await supabase
      .from('cart_items')
      .select('id')
      .eq('user_id', user.id)
      .eq('drone_id', droneId)
      .maybeSingle();

    if (error && error.code !== 'PGRST116') { // PGRST116 is "not found" error
      throw error;
    }

    return { inCart: !!data };
  } catch (error) {
    console.error('Error checking if drone is in cart:', error);
    return { inCart: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
};

// Check if drone is in wishlist
export const isDroneInWishlist = async (droneId: string): Promise<{ inWishlist: boolean; error?: string }> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return { inWishlist: false, error: 'User not authenticated' };
    }

    const { data, error } = await supabase
      .from('wishlist_items')
      .select('id')
      .eq('user_id', user.id)
      .eq('drone_id', droneId)
      .maybeSingle();

    if (error && error.code !== 'PGRST116') { // PGRST116 is "not found" error
      throw error;
    }

    return { inWishlist: !!data };
  } catch (error) {
    console.error('Error checking if drone is in wishlist:', error);
    return { inWishlist: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
};