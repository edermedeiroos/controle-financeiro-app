package br.com.projeto.service;

import java.util.List;

import br.com.projeto.model.Categoria;
import br.com.projeto.repository.CategoriaRepository;
import br.com.projeto.repository.TransacaoRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

@Service
public class CategoriaService {

    private final CategoriaRepository categoriaRepository;
    private final TransacaoRepository transacaoRepository;

    public CategoriaService(CategoriaRepository categoriaRepository, TransacaoRepository transacaoRepository) {
        this.categoriaRepository = categoriaRepository;
        this.transacaoRepository = transacaoRepository;
    }

    public List<Categoria> listarTodas() {
        return categoriaRepository.findAll(Sort.by(Sort.Direction.ASC, "nome"));
    }

    public Categoria buscarPorId(Long id) {
        return categoriaRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Categoria com ID " + id + " não encontrada."));
    }

    public Categoria salvar(Categoria categoria) {
        String nomeLimpo = categoria.getNome() != null ? categoria.getNome().trim() : "";
        if (categoriaRepository.existsByNomeIgnoreCase(nomeLimpo)) {
            throw new IllegalArgumentException("Esta categoria já está cadastrada.");
        }
        categoria.setNome(nomeLimpo);
        return categoriaRepository.save(categoria);
    }

    public void excluir(Long id) {
        if (!categoriaRepository.existsById(id)) {
            throw new EntityNotFoundException("Categoria com ID " + id + " não encontrada.");
        }
        if (transacaoRepository.existsByCategoriaId(id)) {
            throw new IllegalStateException("Não é possível excluir uma categoria vinculada a transações.");
        }
        categoriaRepository.deleteById(id);
    }
}
