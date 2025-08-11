import { useEffect, useState } from 'react';

const App = () => {
    const [authId, setAuthId] = useState('');
    const [domain, setDomain] = useState('');
    const [deals, setDeals] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [debugInfo, setDebugInfo] = useState({});

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const authIdParam = urlParams.get('auth_id') || urlParams.get('AUTH_ID');
        const domainParam = urlParams.get('domain') || urlParams.get('DOMAIN');

        // Debug info
        const allParams = {};
        for (let [key, value] of urlParams.entries()) {
            allParams[key] = value;
        }
        setDebugInfo({ 
            allParams, 
            currentUrl: window.location.href,
            foundAuthId: authIdParam,
            foundDomain: domainParam
        });

        if (authIdParam && domainParam) {
            setAuthId(authIdParam);
            setDomain(domainParam);
        }
    }, []);

    const fetchDeals = async () => {
        if (!authId || !domain) {
            setError('Missing authentication data');
            return;
        }

        console.log('Fetching deals for:', { authId, domain });
        setLoading(true);
        setError('');
        
        try {
            const response = await fetch('http://localhost:3001/get-deals?auth_id=' + authId + '&domain=' + domain, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log('Deals fetched:', data);
            setDeals(data.result || []);
        } catch (error) {
            console.error('Error fetching deals:', error);
            setError(`Failed to fetch deals: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    const getStageColor = (stage) => {
        const colors = {
            'NEW': 'bg-blue-100 text-blue-800 border-blue-200',
            'PREPARATION': 'bg-yellow-100 text-yellow-800 border-yellow-200', 
            'PREPAYMENT_INVOICE': 'bg-orange-100 text-orange-800 border-orange-200',
            'WON': 'bg-green-100 text-green-800 border-green-200',
            'LOSE': 'bg-red-100 text-red-800 border-red-200',
            'APOLOGY': 'bg-gray-100 text-gray-800 border-gray-200',
            'FINAL_INVOICE': 'bg-purple-100 text-purple-800 border-purple-200',
            'DEFAULT': 'bg-gray-100 text-gray-800 border-gray-200'
        };
        return colors[stage] || colors['DEFAULT'];
    };

    const formatCurrency = (amount) => {
        if (!amount) return '₹0';
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 0
        }).format(parseFloat(amount));
    };

    const totalOpportunity = deals.reduce((sum, deal) => sum + parseFloat(deal.OPPORTUNITY || 0), 0);
    const wonDeals = deals.filter(deal => deal.STAGE_ID === 'WON').length;

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
            {/* Header Section */}
            <div className="bg-white shadow-lg border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-6 py-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                                Bitrix24 Integration
                            </h1>
                            <p className="text-gray-600 mt-2 text-lg">Welcome to your deals dashboard</p>
                        </div>
                        {domain && (
                            <div className="flex items-center space-x-4">
                                <div className="text-right">
                                    <p className="text-sm text-gray-500">Connected to</p>
                                    <p className="font-semibold text-gray-800">{domain}</p>
                                </div>
                                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-8">
                {authId && domain ? (
                    <div className="space-y-8">
                        {/* Action Button */}
                        <div className="text-center">
                            <button
                                onClick={fetchDeals}
                                disabled={loading}
                                className={`
                                    px-8 py-4 rounded-xl font-semibold text-white text-lg
                                    transform transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-4
                                    ${loading 
                                        ? 'bg-gray-400 cursor-not-allowed' 
                                        : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl focus:ring-blue-300'
                                    }
                                `}
                            >
                                {loading ? (
                                    <div className="flex items-center space-x-3">
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        <span>Loading Deals...</span>
                                    </div>
                                ) : (
                                    <div className="flex items-center space-x-2">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                        </svg>
                                        <span>Get Deals</span>
                                    </div>
                                )}
                            </button>
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="bg-red-50 border-l-4 border-red-400 p-6 rounded-r-lg">
                                <div className="flex items-center">
                                    <svg className="w-5 h-5 text-red-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                    </svg>
                                    <p className="text-red-700 font-medium">{error}</p>
                                </div>
                            </div>
                        )}

                        {/* Summary Cards */}
                        {deals.length > 0 && (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                                <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
                                    <div className="flex items-center">
                                        <div className="p-3 bg-blue-100 rounded-lg">
                                            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                            </svg>
                                        </div>
                                        <div className="ml-4">
                                            <p className="text-gray-500 text-sm">Total Deals</p>
                                            <p className="text-2xl font-bold text-gray-900">{deals.length}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
                                    <div className="flex items-center">
                                        <div className="p-3 bg-green-100 rounded-lg">
                                            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                                            </svg>
                                        </div>
                                        <div className="ml-4">
                                            <p className="text-gray-500 text-sm">Total Value</p>
                                            <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalOpportunity)}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
                                    <div className="flex items-center">
                                        <div className="p-3 bg-purple-100 rounded-lg">
                                            <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                            </svg>
                                        </div>
                                        <div className="ml-4">
                                            <p className="text-gray-500 text-sm">Won Deals</p>
                                            <p className="text-2xl font-bold text-gray-900">{wonDeals}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Deals List */}
                        {deals.length > 0 && (
                            <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
                                <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                                    <h3 className="text-xl font-semibold text-gray-900">Your Deals</h3>
                                    <p className="text-gray-600 text-sm mt-1">Manage and track your sales opportunities</p>
                                </div>
                                
                                <div className="divide-y divide-gray-200">
                                    {deals.map((deal, index) => (
                                        <div 
                                            key={deal.ID}
                                            className="p-6 hover:bg-gray-50 transition-colors duration-150"
                                        >
                                            <div className="flex items-center justify-between">
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center space-x-3">
                                                        <div className="flex-shrink-0">
                                                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                                                                <span className="text-white font-semibold text-sm">#{deal.ID}</span>
                                                            </div>
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <h4 className="text-lg font-semibold text-gray-900 truncate">
                                                                <a href={`https://${domain}/crm/deal/details/${deal.ID}`} target="_blank" rel="noopener noreferrer">{deal.TITLE}</a>
                                                            </h4>
                                                            <div className="flex items-center space-x-4 mt-2">
                                                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStageColor(deal.STAGE_ID)}`}>
                                                                    {deal.STAGE_ID?.replace(/_/g, ' ') || 'Unknown'}
                                                                </span>
                                                                {deal.ASSIGNED_BY_ID && (
                                                                    <span className="text-sm text-gray-500">
                                                                        Assigned to: {deal.ASSIGNED_BY_ID}
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex-shrink-0 text-right">
                                                    <div className="text-2xl font-bold text-green-600">
                                                        {formatCurrency(deal.OPPORTUNITY)}
                                                    </div>
                                                    <div className="text-sm text-gray-500 mt-1">
                                                        Opportunity Value
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="text-center py-16">
                        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-12 max-w-2xl mx-auto">
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-4">
                                Loading Authentication Data
                            </h3>
                            <p className="text-gray-600 mb-6">
                                Waiting for authentication data from Bitrix24...
                            </p>
                            
                            {/* Debug Information */}
                            <div className="bg-gray-50 rounded-lg p-4 text-left">
                                <h4 className="font-semibold text-gray-700 mb-2">Debug Information:</h4>
                                <div className="text-sm text-gray-600 space-y-1">
                                    <div><strong>Current URL:</strong> {debugInfo.currentUrl}</div>
                                    <div><strong>Found Auth ID:</strong> {debugInfo.foundAuthId || 'Not found'}</div>
                                    <div><strong>Found Domain:</strong> {debugInfo.foundDomain || 'Not found'}</div>
                                    <div><strong>All URL Parameters:</strong></div>
                                    <pre className="bg-white p-2 rounded text-xs overflow-auto max-h-32 mt-1">
                                        {JSON.stringify(debugInfo.allParams, null, 2)}
                                    </pre>
                                </div>
                            </div>
                            
                            <div className="mt-6 text-sm text-gray-500">
                                Make sure your Bitrix24 app is properly configured and the handler is redirecting with the correct parameters.
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default App;