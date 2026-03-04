import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const alt = 'Papa-Quest | 産後クライシス予防・パパ向け育児支援アプリ';
export const size = {
    width: 1200,
    height: 630,
};
export const contentType = 'image/png';

export default async function Image() {
    return new ImageResponse(
        (
            <div
                style={{
                    background: 'linear-gradient(to right bottom, #ebf8ff, #ffffff, #fff5f5)',
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '40px',
                }}
            >
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: 'white',
                        borderRadius: '40px',
                        padding: '60px',
                        boxShadow: '0 20px 40px rgba(0,0,0,0.05)',
                        border: '2px solid rgba(59, 130, 246, 0.1)',
                        width: '90%',
                        height: '80%',
                    }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '40px' }}>
                        <span style={{ fontSize: '80px', marginRight: '20px' }}>👨‍👶</span>
                        <span style={{ fontSize: '80px' }}>⚔️</span>
                    </div>

                    <h1
                        style={{
                            fontSize: '84px',
                            fontWeight: 900,
                            background: 'linear-gradient(to right, #2563eb, #4f46e5)',
                            backgroundClip: 'text',
                            color: 'transparent',
                            marginBottom: '20px',
                            fontFamily: 'sans-serif',
                        }}
                    >
                        Papa-Quest
                    </h1>

                    <p
                        style={{
                            fontSize: '40px',
                            color: '#4b5563',
                            textAlign: 'center',
                            fontWeight: 600,
                            marginBottom: '40px',
                            lineHeight: 1.4,
                        }}
                    >
                        1日1ミッション。<br />新米パパのためのRPG風 育児支援アプリ
                    </p>

                    <div
                        style={{
                            display: 'flex',
                            gap: '24px',
                        }}
                    >
                        <div style={{ background: '#eff6ff', color: '#1d4ed8', padding: '16px 32px', borderRadius: '99px', fontSize: '28px', fontWeight: 'bold' }}>
                            プレッシャーゼロ
                        </div>
                        <div style={{ background: '#fef2f2', color: '#b91c1c', padding: '16px 32px', borderRadius: '99px', fontSize: '28px', fontWeight: 'bold' }}>
                            産後クライシス予防
                        </div>
                        <div style={{ background: '#f5f3ff', color: '#6d28d9', padding: '16px 32px', borderRadius: '99px', fontSize: '28px', fontWeight: 'bold' }}>
                            完全無料
                        </div>
                    </div>
                </div>
            </div>
        ),
        {
            ...size,
        }
    );
}
