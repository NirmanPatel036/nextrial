/**
 * Conversation and Message Management
 * Helper functions for chat memory persistence using Supabase
 */

import { createBrowserClient } from '@supabase/ssr';

export interface Conversation {
    id: string;
    user_id: string;
    title: string;
    created_at: string;
    updated_at: string;
    last_message_at: string;
}

export interface Message {
    id: string;
    conversation_id: string;
    role: 'user' | 'assistant';
    content: string;
    metadata?: any;
    created_at: string;
}

const getSupabase = () => {
    return createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
};

/**
 * Generate a conversation title from the first message
 */
export function generateConversationTitle(firstMessage: string): string {
    // Take first 50 characters or up to first newline
    const title = firstMessage.split('\n')[0].slice(0, 50);
    return title.length < firstMessage.length ? `${title}...` : title;
}

/**
 * Create a new conversation
 */
export async function createConversation(
    userId: string,
    title?: string
): Promise<Conversation | null> {
    const supabase = getSupabase();

    const { data, error } = await supabase
        .from('conversations')
        .insert({
            user_id: userId,
            title: title || 'New Conversation',
        })
        .select()
        .single();

    if (error) {
        console.error('Error creating conversation:', error);
        return null;
    }

    return data;
}

/**
 * Get all conversations for a user
 */
export async function getConversations(userId: string): Promise<Conversation[]> {
    const supabase = getSupabase();

    const { data, error } = await supabase
        .from('conversations')
        .select('*')
        .eq('user_id', userId)
        .order('last_message_at', { ascending: false });

    if (error) {
        console.error('Error fetching conversations:', error);
        return [];
    }

    return data || [];
}

/**
 * Get a single conversation by ID
 */
export async function getConversation(
    conversationId: string
): Promise<Conversation | null> {
    const supabase = getSupabase();

    const { data, error } = await supabase
        .from('conversations')
        .select('*')
        .eq('id', conversationId)
        .single();

    if (error) {
        console.error('Error fetching conversation:', error);
        return null;
    }

    return data;
}

/**
 * Update conversation title
 */
export async function updateConversationTitle(
    conversationId: string,
    title: string
): Promise<boolean> {
    const supabase = getSupabase();

    const { error } = await supabase
        .from('conversations')
        .update({ title })
        .eq('id', conversationId);

    if (error) {
        console.error('Error updating conversation title:', error);
        return false;
    }

    return true;
}

/**
 * Delete a conversation (will cascade delete messages)
 */
export async function deleteConversation(conversationId: string): Promise<boolean> {
    const supabase = getSupabase();

    const { error } = await supabase
        .from('conversations')
        .delete()
        .eq('id', conversationId);

    if (error) {
        console.error('Error deleting conversation:', error);
        return false;
    }

    return true;
}

/**
 * Save a message to a conversation
 */
export async function saveMessage(
    conversationId: string,
    role: 'user' | 'assistant',
    content: string,
    metadata?: any
): Promise<Message | null> {
    const supabase = getSupabase();

    const { data, error } = await supabase
        .from('messages')
        .insert({
            conversation_id: conversationId,
            role,
            content,
            metadata: metadata || {},
        })
        .select()
        .single();

    if (error) {
        console.error('Error saving message:', error);
        return null;
    }

    return data;
}

/**
 * Get all messages for a conversation
 */
export async function getMessages(conversationId: string): Promise<Message[]> {
    const supabase = getSupabase();

    const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });

    if (error) {
        console.error('Error fetching messages:', error);
        return [];
    }

    return data || [];
}

/**
 * Delete all messages in a conversation
 */
export async function deleteMessages(conversationId: string): Promise<boolean> {
    const supabase = getSupabase();

    const { error } = await supabase
        .from('messages')
        .delete()
        .eq('conversation_id', conversationId);

    if (error) {
        console.error('Error deleting messages:', error);
        return false;
    }

    return true;
}
