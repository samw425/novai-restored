/**
 * Credit Service for Skip Tracing Monetization
 * Manages user credit balance for paid lookups
 */

import { supabase } from '../supabase/client';

export interface CreditPackage {
    id: string;
    name: string;
    credits: number;
    price: number;
    savings?: string;
    popular?: boolean;
}

export interface CreditTransaction {
    id: string;
    userId: string;
    amount: number;
    type: 'PURCHASE' | 'USAGE' | 'REFUND' | 'BONUS';
    description: string;
    propertyId?: string;
    createdAt: string;
}

export const CREDIT_PACKAGES: CreditPackage[] = [
    { id: 'starter', name: 'Starter', credits: 10, price: 9.99 },
    { id: 'pro', name: 'Pro Pack', credits: 50, price: 39.99, savings: '20% off', popular: true },
    { id: 'enterprise', name: 'Enterprise', credits: 200, price: 129.99, savings: '35% off' },
    { id: 'unlimited', name: 'Unlimited Monthly', credits: 999, price: 299.99, savings: 'Best value' }
];

export class CreditService {
    /**
     * Get current credit balance for a user
     */
    static async getBalance(userId: string): Promise<number> {
        // Fallback to localStorage if Supabase isn't configured or fails
        const getLocalBalance = () => {
            const raw = localStorage.getItem(`zenith_credits_${userId}`);
            return raw ? parseInt(raw) : 3; // 3 free starter credits
        };

        try {
            if (!supabase) return getLocalBalance();

            const { data, error } = await supabase
                .from('user_credits')
                .select('balance')
                .eq('user_id', userId)
                .single();

            if (error || !data) {
                return getLocalBalance();
            }

            return data.balance || 0;
        } catch (error) {
            return getLocalBalance();
        }
    }

    /**
     * Deduct credits from user balance
     */
    static async deduct(userId: string, amount: number, reason: string, propertyId?: string): Promise<boolean> {
        const currentBalance = await this.getBalance(userId);
        if (currentBalance < amount) return false;

        const newBalance = currentBalance - amount;

        // Local Update
        localStorage.setItem(`zenith_credits_${userId}`, newBalance.toString());

        // Log transaction locally
        const txs = JSON.parse(localStorage.getItem(`zenith_txs_${userId}`) || '[]');
        txs.unshift({
            id: Math.random().toString(36).substr(2, 9),
            userId,
            amount: -amount,
            type: 'USAGE',
            description: reason,
            propertyId,
            createdAt: new Date().toISOString()
        });
        localStorage.setItem(`zenith_txs_${userId}`, JSON.stringify(txs.slice(0, 50)));

        // Attempt Supabase Sync
        try {
            if (supabase) {
                await supabase.from('user_credits').upsert({ user_id: userId, balance: newBalance, updated_at: new Date().toISOString() });
                await supabase.from('credit_transactions').insert({ user_id: userId, amount: -amount, type: 'USAGE', description: reason, property_id: propertyId });
            }
        } catch (e) {
            console.warn('[CreditService] Supabase sync failed, kept local.');
        }

        return true;
    }

    /**
     * Add credits to user balance (for purchases)
     */
    static async addCredits(userId: string, packageId: string): Promise<boolean> {
        const pkg = CREDIT_PACKAGES.find(p => p.id === packageId);
        if (!pkg) return false;

        try {
            const currentBalance = await this.getBalance(userId);

            const { error } = await supabase
                .from('user_credits')
                .upsert({
                    user_id: userId,
                    balance: currentBalance + pkg.credits,
                    updated_at: new Date().toISOString()
                });

            if (error) throw error;

            // Log transaction
            await supabase
                .from('credit_transactions')
                .insert({
                    user_id: userId,
                    amount: pkg.credits,
                    type: 'PURCHASE',
                    description: `Purchased ${pkg.name} (${pkg.credits} credits)`,
                    created_at: new Date().toISOString()
                });

            return true;
        } catch (error) {
            console.error('[CreditService] Add credits failed:', error);
            return false;
        }
    }

    /**
     * Get transaction history for a user
     */
    static async getHistory(userId: string, limit = 20): Promise<CreditTransaction[]> {
        try {
            const { data, error } = await supabase
                .from('credit_transactions')
                .select('*')
                .eq('user_id', userId)
                .order('created_at', { ascending: false })
                .limit(limit);

            if (error) throw error;

            return data?.map(t => ({
                id: t.id,
                userId: t.user_id,
                amount: t.amount,
                type: t.type,
                description: t.description,
                propertyId: t.property_id,
                createdAt: t.created_at
            })) || [];
        } catch (error) {
            console.error('[CreditService] Get history failed:', error);
            return [];
        }
    }

    /**
     * Check if user can perform skip trace
     */
    static async canSkipTrace(userId: string): Promise<{ canTrace: boolean; balance: number }> {
        const balance = await this.getBalance(userId);
        return {
            canTrace: balance >= 1,
            balance
        };
    }
}
