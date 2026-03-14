const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

module.exports = async (req, res) => {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        const { items } = req.body;

        // Stripe Checkout Sessionの作成
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: items.map(item => ({
                price_data: {
                    currency: 'jpy',
                    product_data: {
                        name: item.name,
                        // 画像URLがある場合はここに追加可能
                        // images: [item.image], 
                    },
                    unit_amount: item.price,
                },
                quantity: item.quantity,
            })),
            mode: 'payment',
            // 本番環境に合わせてURLを調整（Vercel等の場合は環境変数から取得するのが理想的）
            success_url: `${req.headers.origin}/online_shop.html?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${req.headers.origin}/online_shop.html`,
        });

        res.status(200).json({ url: session.url });
    } catch (err) {
        console.error('Stripe Error:', err);
        res.status(500).json({ error: err.message });
    }
};
