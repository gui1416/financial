-- Insert default categories for new users
-- This will be handled by the application when a user signs up

-- Function to create default categories for a user
CREATE OR REPLACE FUNCTION public.create_default_categories(user_uuid UUID)
RETURNS VOID AS $$
BEGIN
  INSERT INTO public.categories (user_id, name, color, icon) VALUES
    (user_uuid, 'Alimentação', '#EF4444', 'utensils'),
    (user_uuid, 'Transporte', '#3B82F6', 'car'),
    (user_uuid, 'Moradia', '#10B981', 'home'),
    (user_uuid, 'Saúde', '#F59E0B', 'heart'),
    (user_uuid, 'Educação', '#8B5CF6', 'book'),
    (user_uuid, 'Entretenimento', '#EC4899', 'gamepad-2'),
    (user_uuid, 'Salário', '#22C55E', 'banknote'),
    (user_uuid, 'Freelance', '#06B6D4', 'laptop'),
    (user_uuid, 'Investimentos', '#84CC16', 'trending-up'),
    (user_uuid, 'Outros', '#6B7280', 'more-horizontal');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update the handle_new_user function to create default categories
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
  
  -- Create default categories for the new user
  PERFORM public.create_default_categories(NEW.id);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
