import React, { useState, useMemo } from 'react';
import { documentHub } from '../data/documentData';
import type { ProcessDocument } from '../data/types';
import { Search, BookOpen, Clock, User, ChevronRight, FileText, Download, AlignLeft } from 'lucide-react';

const ProcessDocumentation: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDoc, setSelectedDoc] = useState<ProcessDocument | null>(null);

  const filteredDocs = useMemo(() => {
    return documentHub.filter(doc => 
      doc.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      doc.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [searchTerm]);

  return (
    <div className="animate-in fade-in duration-500 h-[calc(100vh-8rem)] flex flex-col">
      
      {/* Header & Search */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-[#E2E6EA] mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0">
        <div>
          <h2 className="text-xl font-bold text-[#1A1A2E] flex items-center gap-2">
            <BookOpen className="text-[#0069B4]" /> P2P Standard Operating Procedures
          </h2>
          <p className="text-sm text-[#5A6478] mt-1">Official process guidelines, policies, and onboarding documentation.</p>
        </div>
        
        <div className="relative w-full md:w-96">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2.5 border border-[#E2E6EA] rounded-lg leading-5 bg-gray-50 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#0069B4] focus:border-[#0069B4] sm:text-sm transition-smooth"
            placeholder="Search documents, topics, or tags..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="flex-1 flex gap-6 overflow-hidden">
        
        {/* Document List */}
        <div className={`flex flex-col gap-4 overflow-y-auto pr-2 custom-scrollbar transition-all duration-300 ${selectedDoc ? 'w-1/3' : 'w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3'}`}>
          {filteredDocs.map(doc => (
            <div 
              key={doc.id}
              onClick={() => setSelectedDoc(doc)}
              className={`bg-white rounded-xl shadow-sm border p-5 cursor-pointer transition-all duration-200 flex flex-col hover:shadow-md hover:border-[#0069B4] ${
                selectedDoc?.id === doc.id ? 'border-[#0069B4] ring-1 ring-[#0069B4]' : 'border-[#E2E6EA]'
              }`}
            >
              <div className="flex justify-between items-start mb-3">
                <div className="p-2 bg-blue-50 rounded-lg text-[#0069B4]">
                  <FileText size={20} />
                </div>
                <span className="text-xs font-semibold px-2 py-1 bg-gray-100 text-[#5A6478] rounded">v{doc.version}</span>
              </div>
              
              <h3 className="font-semibold text-[#1A1A2E] mb-2 leading-tight">{doc.title}</h3>
              <p className="text-sm text-[#5A6478] line-clamp-2 mb-4 flex-1">{doc.description}</p>
              
              <div className="flex flex-wrap gap-2 mb-4">
                {doc.tags.slice(0, 3).map(tag => (
                  <span key={tag} className="text-[10px] uppercase font-bold text-[#0069B4] bg-blue-50 px-2 py-1 rounded-full tracking-wider">
                    {tag}
                  </span>
                ))}
                {doc.tags.length > 3 && (
                  <span className="text-[10px] uppercase font-bold text-[#5A6478] bg-gray-100 px-2 py-1 rounded-full tracking-wider">
                    +{doc.tags.length - 3}
                  </span>
                )}
              </div>
              
              <div className="pt-4 border-t border-[#E2E6EA] flex items-center justify-between mt-auto">
                <div className="flex flex-col gap-1">
                  <span className="text-xs text-[#5A6478] flex items-center gap-1.5">
                    <User size={12} /> {doc.owner}
                  </span>
                  <span className="text-xs text-[#5A6478] flex items-center gap-1.5">
                    <Clock size={12} /> Updated: {doc.lastUpdated}
                  </span>
                </div>
                {!selectedDoc && (
                  <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-[#0069B4] group-hover:bg-[#003B7A] group-hover:text-white transition-colors">
                    <ChevronRight size={18} />
                  </div>
                )}
              </div>
            </div>
          ))}
          
          {filteredDocs.length === 0 && (
            <div className="col-span-full bg-white rounded-xl shadow-sm border border-[#E2E6EA] p-12 text-center flex flex-col items-center justify-center">
              <Search className="text-gray-300 w-12 h-12 mb-4" />
              <h3 className="text-lg font-medium text-[#1A1A2E]">No documents found</h3>
              <p className="text-[#5A6478] mt-1">Try adjusting your search terms or filters.</p>
            </div>
          )}
        </div>

        {/* Document Viewer (Reader Mode) */}
        {selectedDoc && (
          <div className="w-2/3 bg-white rounded-xl shadow-sm border border-[#E2E6EA] flex flex-col overflow-hidden animate-in slide-in-from-right-4 duration-300">
            <div className="px-8 py-6 border-b border-[#E2E6EA] flex justify-between items-start bg-[#F8F9FB]">
              <div>
                <h2 className="text-2xl font-bold text-[#1A1A2E] mb-2">{selectedDoc.title}</h2>
                <div className="flex gap-4">
                  <span className="text-sm font-medium text-[#5A6478] bg-white px-3 py-1 rounded border border-[#E2E6EA]">
                    Version {selectedDoc.version}
                  </span>
                  <span className="text-sm text-[#5A6478] flex items-center gap-2">
                    <User size={14} /> Owner: {selectedDoc.owner}
                  </span>
                  <span className="text-sm text-[#5A6478] flex items-center gap-2">
                    <Clock size={14} /> Last Modified: {selectedDoc.lastUpdated}
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="p-2 text-[#5A6478] hover:text-[#0069B4] hover:bg-blue-50 rounded-lg transition-colors" title="Download PDF">
                  <Download size={20} />
                </button>
                <button 
                  onClick={() => setSelectedDoc(null)}
                  className="p-2 text-[#5A6478] hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-200"
                  title="Close document"
                >
                  Close
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-8 custom-scrollbar relative">
              <div className="max-w-3xl mx-auto prose prose-blue">
                {/* Interpret the content markdown-style loosely for the mock */}
                {selectedDoc.content.split('\n\n').map((paragraph, idx) => {
                  if (paragraph.startsWith('###')) {
                    return <h3 key={idx} className="text-xl font-bold text-[#1A1A2E] mt-8 mb-4 border-b border-[#E2E6EA] pb-2">{paragraph.replace('###', '').trim()}</h3>;
                  }
                  if (paragraph.startsWith('-')) {
                    return (
                      <ul key={idx} className="list-disc pl-5 mt-4 space-y-2 text-[#5A6478] leading-relaxed">
                        {paragraph.split('\n').map((item, i) => (
                          <li key={i}>{item.replace('-', '').trim()}</li>
                        ))}
                      </ul>
                    );
                  }
                  return <p key={idx} className="text-[#5A6478] leading-relaxed mb-4">{paragraph}</p>;
                })}
              </div>
            </div>
            
            <div className="bg-gray-50 px-8 py-3 border-t border-[#E2E6EA] flex justify-between items-center text-xs text-[#5A6478]">
              <span className="flex items-center gap-1.5"><AlignLeft size={14} /> End of Document</span>
              <span>Document ID: DOC-{selectedDoc.id.split('-').shift()?.toUpperCase() || 'SYS'}</span>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default ProcessDocumentation;
