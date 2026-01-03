import React from 'react';

const AccountSection: React.FC = () => {
    return (
        <div className="space-y-8 animate-slideUp">

            {/* Mock Profile Card */}
            <div className="bg-[#141414] border border-white/5 rounded-xl overflow-hidden">
                <div className="p-8 flex items-center space-x-6">
                    <div className="w-20 h-20 rounded-md bg-gradient-to-br from-red-600 to-red-900 flex items-center justify-center shadow-lg">
                        <span className="text-3xl font-bold text-white">JD</span>
                    </div>
                    <div>
                        <h3 className="text-2xl font-bold text-white">John Doe</h3>
                        <p className="text-gray-400">member since 2024</p>
                        <div className="mt-3 flex items-center space-x-3">
                            <span className="bg-white/10 text-white text-xs px-2 py-1 rounded font-medium uppercase tracking-wider">Premium Plan</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex flex-col items-center justify-center py-12 text-center border-t border-white/5 border-dashed">
                <span className="material-icons text-3xl text-gray-600 mb-4">lock_clock</span>
                <p className="text-gray-500">Account management features are currently disabled in this demo.</p>
            </div>

        </div>
    );
};

export default AccountSection;
