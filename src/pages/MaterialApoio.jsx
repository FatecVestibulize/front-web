import React, { useState, useEffect, useRef } from "react";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Tooltip } from 'primereact/tooltip'; 
import Header from "../components/Header";
import Listagem from "../components/Listagem";
import Modal from "../components/Modal";
import { useNavigate, useParams } from 'react-router-dom'; 
import apiVestibulizeClient, { traitExpiredToken } from "../utils/apiVestibulizeClient";
import InputTextArea from "../components/InputTextArea";
import Navbar from "../components/Navbar";
import { Toast } from 'primereact/toast';
import { confirmDialog, ConfirmDialog } from 'primereact/confirmdialog';

const MaterialApoio = () => {

    const navigate = useNavigate();
    const toast = useRef(null);
    const { notebook_id } = useParams();
    const { note_id } = useParams();

    const [filtro, setFiltro] = useState("");
    const [materiaisApoio, setMateriaisApoio] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingMaterialApoio, setEditingMaterialApoio] = useState(null);
    const [titulo, setTitulo] = useState("");
    const [support_material, setSupport_material] = useState("");
    const [selectedFile, setSelectedFile] = useState(null);

    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [viewingMaterialApoio, setViewingMaterialApoio] = useState(null);

    useEffect(() => {
        getMateriaisApoio();
    }, []);

    const getMateriaisApoio = async () => {
        const params = filtro.trim().length > 3 ? { search: filtro.trim() } : {};
        try {
            const response = await apiVestibulizeClient.get(`note/${note_id}/support-material`, { 
                headers: { token: `${localStorage.getItem('token')}` },
                params: params
            });

            if (response?.data) {
                setMateriaisApoio(response.data.map((item) => ({
                    data: item.created_at === null ? null : new Date(item.created_at).toLocaleDateString("pt-BR"),
                    titulo: item.title,
                    url: item.url,
                    id: item.id
                })));
            }
        } catch (error) {
            console.error("Erro ao buscar materiais de apoio:", error);
            toast.current?.show({ severity: 'error', summary: 'Erro', detail: 'Erro ao buscar materiais de apoio.', life: 3000 });
        }
    };

    const handleOpenModal = (item = null) => {
        setIsViewModalOpen(false);
        setEditingMaterialApoio(item);
        setTitulo(item ? item.titulo : "");
        setSupport_material(item ? item.support_material : "");
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingMaterialApoio(null);
        setTitulo("");
        setSupport_material("");
        setSelectedFile(null);
    };
    
    const handleCloseViewModal = () => {
        setIsViewModalOpen(false);
        setViewingMaterialApoio(null);
    };

    const handleSave = async () => {
        
        const dados = {
            id: editingMaterialApoio ? editingMaterialApoio.id : null,
            title: titulo,
            notebook_id: notebook_id,
            support_material: support_material,
        };

        if (editingMaterialApoio) {
            apiVestibulizeClient.put('support-material/' + dados.id, dados, { headers: {
                token: `${localStorage.getItem('token')}` 
            }}).then(() => {
                toast.current?.show({ severity: 'success', summary: 'Sucesso', detail: 'Material de apoio atualizado com sucesso!', life: 3000 });
                getMateriaisApoio();
            }).catch(error => {
                console.error(error);
                traitExpiredToken(error.response.data.message);
                toast.current?.show({ severity: 'error', summary: 'Erro', detail: 'Erro ao atualizar material de apoio.', life: 3000 });
            }).finally(() => handleCloseModal());
        } else {

            if (!selectedFile) {
                toast.current?.show({ severity: 'warn', summary: 'Aviso', detail: 'Selecione um arquivo para o material de apoio.', life: 3000 });
                return;
            }

            const formDataUpload = new FormData();
            formDataUpload.append("support_material", selectedFile);

            apiVestibulizeClient.post(`note/${note_id}/support-material`, formDataUpload, { 
                headers: {
                    "Content-Type": "multipart/form-data",
                    token: `${localStorage.getItem('token')}` 
                }
            }).then(() => {
                toast.current?.show({ severity: 'success', summary: 'Sucesso', detail: 'Material de apoio criado com sucesso!', life: 3000 });
                getMateriaisApoio();
            }).catch(error => {
                console.error(error);
                traitExpiredToken(error?.response?.data?.message);
                toast.current?.show({ severity: 'error', summary: 'Erro', detail: 'Erro ao criar material de apoio.', life: 3000 });
            }).finally(() => handleCloseModal());
        }
    };

    const confirmDelete = (id) => {
        confirmDialog({
            message: 'Tem certeza que deseja excluir este material de apoio?',
            header: 'Confirmar exclusão',
            icon: 'pi pi-exclamation-triangle',
            acceptClassName: 'p-button-text p-button-success',
            rejectClassName: 'p-button-text p-button-danger',
            acceptLabel: 'Sim, excluir',
            rejectLabel: 'Cancelar',
            accept: () => {
                apiVestibulizeClient.delete('support-material/' + id, { headers: {
                    token: `${localStorage.getItem('token')}` 
                }}).then(() => {
                    toast.current?.show({ severity: 'success', summary: 'Sucesso', detail: 'Material de apoio excluído com sucesso!', life: 3000 });
                    getMateriaisApoio();
                }).catch(error => {
                    console.error(error);
                    traitExpiredToken(error.response.data.message);
                    toast.current?.show({ severity: 'error', summary: 'Erro', detail: 'Erro ao excluir material de apoio.', life: 3000 });
                });
            }
        });
    };

    const formStyles = {
        input: {
            width: '100%',
            borderRadius: '8px',
            backgroundColor: '#2e2e42',
            border: '1px solid #4a4a60',
            color: '#e0e0e0',
            padding: '12px 15px',
        },
        button: {
            width: '100%',
            padding: '12px 0',
            borderRadius: '8px',
            backgroundColor: '#46397d',
            border: 'none',
            color: '#e0e0e0',
            marginTop: '15px',
            fontWeight: 'bold',
            letterSpacing: '1px',
        },
    };

    const iconStyle = {
        marginLeft: '8px',
        color: '#977acfff',
        cursor: 'help',
        fontSize: '0.7em',
    };

    const modalFormJSX = (
        <form onSubmit={(e) => { e.preventDefault(); handleSave(); }} style={{ display: "flex", flexDirection: "column" }}>
            
            {editingMaterialApoio ? (
                <div style={{ marginBottom: '20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                        <label htmlFor="titulo" style={{ fontSize: '0.9em', color: '#c0c0c0' }}>Título</label>
                        <i id="tooltip-icon-titulo" className="pi pi-info-circle" style={iconStyle} />
                        <Tooltip target="#tooltip-icon-titulo" content="Título do material de apoio (opcional)." position="top" />
                    </div>
                    <InputText 
                        id="titulo" 
                        value={titulo} 
                        onChange={(e) => setTitulo(e.target.value)} 
                        style={formStyles.input} 
                        placeholder="Digite o título (opcional)"
                        autoFocus 
                    />
                </div>
            ) : (
                <div style={{ marginBottom: '20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                        <label htmlFor="support_material" style={{ fontSize: '0.9em', color: '#c0c0c0' }}>
                            Arquivo {selectedFile && `(${selectedFile.name})`}
                        </label>
                        <i id="tooltip-icon-support_material" className="pi pi-info-circle" style={iconStyle} />
                        <Tooltip target="#tooltip-icon-support_material" content="Selecione o arquivo do material de apoio (PDF, imagem, etc)." position="top" />
                    </div>
                    <input 
                        id="support_material"
                        name="support_material"
                        type="file"
                        onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                                setSelectedFile(file);
                                // Se não tiver título, usa o nome do arquivo sem extensão
                                if (!titulo) {
                                    const nomeArquivo = file.name.replace(/\.[^/.]+$/, "");
                                    setTitulo(nomeArquivo);
                                }
                            }
                        }}
                        style={{
                            ...formStyles.input,
                            paddingTop: '10px',
                            paddingBottom: '10px'
                        }}
                        accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.jpg,.jpeg,.png,.gif"
                    />
                    {selectedFile && (
                        <small style={{ color: '#a0a0a0', marginTop: '5px', display: 'block' }}>
                            Tamanho: {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                        </small>
                    )}
                </div>
            )}

            <Button 
                label={editingMaterialApoio ? "ATUALIZAR" : "ADICIONAR"} 
                style={formStyles.button}
                type="submit"
            />
        </form>
    );

    const createCardActionsGenerator = (materialApoio) => (
        <>
            <Button icon="pi pi-pencil" className="p-button-text p-button-sm" style={{ color: '#ffbc3fff' }} onClick={(e) => { e.stopPropagation(); handleOpenModal(materialApoio); }} />
            <Button icon="pi pi-trash" className="p-button-text p-button-sm" style={{ color: '#e05a2eff' }} onClick={(e) => { e.stopPropagation(); confirmDelete(materialApoio.id); }} />
        </>
    );

    const handleFilterSearch = (e) => {
        setFiltro(e.target.value);
        if (e.target.value.length > 3) getMateriaisApoio();
    };

    const handleCardClick = (material) => {
        console.log(material);
        if (material.url) {
            window.open(material.url, '_blank');
        } else {
            toast.current?.show({ 
                severity: 'warn', 
                summary: 'Aviso', 
                detail: 'Este material não possui arquivo associado.', 
                life: 3000 
            });
        }
    };

    return (
        <main style={{ paddingTop: '55px', background: 'linear-gradient(180deg, #F9F9F9 0%, #E6E9F0 100%)', minHeight: '100vh', width: '100%' }}>
            <Navbar />
            <Toast ref={toast} position="bottom-right" />
            <ConfirmDialog />

            <Header
                title="Material de Apoio"
                searchText={filtro}
                onSearchChange={(e) => handleFilterSearch(e)}
                onAddClick={() => handleOpenModal()}
                searchPlaceholder="Pesquisar por nome do material."
                addButtonLabel="Adicionar Material de Apoio"
                backButton={true}
            />

            <section style={{ padding: "0 20px", maxWidth: "1000px", margin: "30px auto" }}>
                <Listagem
                    listagem={materiaisApoio}
                    headerTitle="Título/Data"
                    headerActions="Ações"
                    cardActionsGenerator={createCardActionsGenerator}
                    onCardClick={handleCardClick}
                />
            </section>

            <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={editingMaterialApoio ? "Atualizar - Material de Apoio" : "Adicionar - Material de Apoio"}>
                {modalFormJSX}
            </Modal>

            <Modal isOpen={isViewModalOpen} onClose={handleCloseViewModal} title={viewingMaterialApoio ? `Visualizar - ${viewingMaterialApoio.titulo}` : "Visualizar Material de Apoio"}>
            </Modal>
        </main>
    );
};

export default MaterialApoio;

