import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const SYSTEM_PROMPT = `You are a helpful AI assistant for ALHAWARIE TOURS, a Ghanaian company specializing in Hajj and Umrah pilgrimage packages. 

About ALHAWARIE TOURS:
- We specialize in creating high-quality, comprehensive, and stress-free packages for the holy pilgrimages of Umrah and Hajj
- Our commitment is to ensure your focus remains solely on your spiritual devotion while we manage all logistics
- We provide: Global ticketing, visa processing, comfortable accommodation near the Holy Sites, reliable transportation, and guidance

Our Services:
1. Global Ticketing - Seamless flight bookings from Ghana to Saudi Arabia with premium carriers
2. Visa Processing - Complete visa handling with expert guidance
3. Accommodation - Premium hotels within walking distance of the Holy Sites
4. Ground Transportation - Reliable, air-conditioned transport between all sacred sites

Our Packages:
- Umrah Essential (10 Days): Return flights, 3-star hotels, visa processing, airport transfers, guided tours
- Umrah Premium (14 Days): Return flights, 5-star hotels near Haram, visa processing, VIP transfers, dedicated guide, Ziyarat tours
- Hajj Complete (21 Days): Return flights, premium tents in Mina, 5-star Makkah & Madinah hotels, all Hajj rituals support, 24/7 assistance

Contact Information:
- P.O. Box TN 2073, Nugua Accra, Ghana
- Office: 9 Calcite St., Spintex Com 18, Block Factory, Accra - Ghana
- Email: info@alhawarie.com

Guidelines:
- Be friendly, helpful, and professional
- Answer questions about our services, packages, and pilgrimage requirements
- If asked about specific pricing, encourage them to book a consultation or use the booking form
- Emphasize our focus on stress-free logistics and spiritual devotion
- Keep responses concise but informative
- If you don't know something specific, direct them to contact us directly`;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limits exceeded, please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Service temporarily unavailable." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(JSON.stringify({ error: "AI service error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (error) {
    console.error("Chat assistant error:", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
